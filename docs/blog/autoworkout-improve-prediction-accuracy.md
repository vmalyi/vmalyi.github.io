---
title: "AutoWorkout: How to Improve Motion Activity Classifier Predictions?"
date:
  created: 2018-01-23
description: Exploring advanced techniques for improving machine learning model predictions in real-world fitness applications. Learn voting algorithms, outlier detection, and how to achieve production-ready accuracy from multiple classifier outputs in iOS/WatchOS apps.
keywords: machine learning, fitness apps, voting algorithms, outlier detection, classifier ensemble, iOS development, WatchOS, AutoWorkout, prediction accuracy, production ML
tags:
  - machine-learning
  - motion-classification
  - prediction-improvement
  - autoworkout
---

# AutoWorkout: How to Improve Motion Activity Classifier Predictions?

## Introduction

Recently I started working on **AutoWorkout iOS/WatchOS app**. It automatically recognizes fitness exercises and provides time spent on each exercise and reps made (in a future release). The idea of this app naturally arose from my first attempts to recognize motion activity type with machine learning by:

1. First collecting motion data
2. Designing a neural network classifier  
3. Then utilizing it in iOS app with help of Core ML

In this article, I intentionally skip app implementation details and concentrate on **making motion activity classifier predictions useful** as it turned out to be the most challenging problem.

## No UI is the Best UI

Before importing pre-trained models to AutoWorkout I was pretty sure they will do a good job predicting fitness exercises. They actually did, but each in its own original way. Here I will take a little step aside and describe how I was going to recognize motion activity at all.

### Why Apple Watch?

Since wrist wearables are capable to provide enough sensor data to predict human motion activity and I already specialize in iOS/Watch OS development, I selected **Apple Watch** as the target device for my app. 

!!! tip "Core ML on watchOS"
    Because of Core ML is supported in Watch OS, I could run classifier directly on the Apple Watch avoiding costly and not always reliable communication between iOS and WatchOS to transfer sensor data to make predictions on iPhone.

The iOS app contained mainly UI presentation code to indicate workout statistics which was being collected and calculated on Apple Watch.

### Minimalist Design Philosophy

I'm a fan of embracing **"No UI is the Best UI"** approach, therefore the only UI elements in WatchOS app were:

- **"Start"** button
- **"Stop"** button

**Workflow**: Just tap "Start", start your workout, do your exercises and tap "Stop" at the end. All your exercises will be recognized, time spent for each of them will be calculated and repetitions are recorded.

*Interface of the Apple Watch app* | *Workout statistics*

## Pre-Trained Neural Network Classifiers

To make this all possible, I needed to utilize pre-trained classifiers which perform predictions based on sensor data each **~1.7 seconds**. 

!!! note "Multiple Classifiers"
    Noticed "classifiers"? Yes, I needed one for each source of the sensor data - X, Y, Z accelerometers - **3 classifiers in total**, each predicting **5 activities** (jumping jacks, push-ups, squats, lunges, and pauses between exercises) in real time.

### Accuracy Results

After countless hours tuning their performance I ended up with acceptable accuracy:

| Classifier | Accuracy |
|------------|----------|
| **X-axis** | 89.09%   |
| **Y-axis** | 85.01%   |
| **Z-axis** | 81.66%   |

!!! note "Accuracy Context"
    Those numbers may seem not really impressive for a classification problem today, but taking into account the time and data collection constraints I had, I find them quite good.

## N Classifiers, N Opinions

After I integrated classifiers into the app and it was clear that they are able to predict fitness exercises, I had to check the quality of those predictions.

### The Reality Check

**Ideally**, the app should log, say a push-up exercise in case if all 3 classifiers predict that this is a push up exercise. 

**In real life**, I had:

- **Less than 5%** cases where all 3 models predicted the same class
- **Nearly 50%** of all cases predictions from 2 of 3 models matched  
- **Another 45%** of cases were all 3 models predicted different classes

!!! warning "The Challenge"
    Not easy to make a decision when you have 3 sources of data and all of them tell you different things, right? This is a well-known issue in machine learning environments where more than a single classifier is present and there are techniques to make use of predictions delivered by multiple sources.

## Voting Algorithm Implementation

In classification machine learning problems **voting** is probably the most simple yet powerful approach to derive a single class out of multiple predictions. The first question you ask yourselves when implementing a voting algorithm is whether it will be **majority voting** or **weighted voting**?

### Hybrid Voting Strategy

In my case, it was clear that **model X** has the highest accuracy, but testing against the ground truth labels had shown that cases where:

- Model X predicted class A (which was not correct)  
- Model Y and Z both predicted class B (and were right)

...are not rare. Therefore, I couldn't just give model X the most influence in voting and use weighted voting - it had to be a **mix of weighted and majority voting** to cover such cases.

### Special Case: Pause Detection

Although, the testing in real life shown that if at least one model predicted **"Pause"** class, the user with a very high probability indeed did a pause during that moment.

### Voting Rules

All those observations gave me a simple set of rules to be considered in my voting algorithm:

1. **If one model predicts "Pause"** → log "Pause"
2. **If ≥ 2 models predict class "A"** → log "A" *(majority voting)*
3. **If all models predict different classes** → use the prediction from model X *(weighted voting)*

!!! success "Improved Predictions"
    After the voting algorithm was included to classification pipeline, I was able to both subjectively and objectively note that predictions became correct and less confusing.

## Outliers Are Everywhere

Nevertheless, the workout statistics visible to the end user was still not perfect: here and there exercises which were not executed during the workout session were popping out.

It all felt like there is some room for improvement and I started to compare predictions made by the voting algorithm with ground truth. When I knew that I made:

- Squats **15 seconds** long
- A **20-seconds pause** after that  
- Then straight **30 seconds of lunges**

...there should be no other classes predicted among those 3 in a workout session.

### Prediction Analysis Example

| Row | Time | Predicted | Ground Truth | Status |
|-----|------|-----------|--------------|---------|
| 6   | 10s  | Lunges    | Squats       | ❌ Error |
| 9   | 15s  | Lunges    | Squats       | ❌ Error |
| 11  | 18s  | Lunges    | Squats       | ❌ Error |
| 21  | 35s  | Lunges    | Pause        | ❌ Early |
| 24  | 40s  | Pause     | Lunges       | ❌ Error |
| 26  | 43s  | Squats    | Lunges       | ❌ Error |
| 29  | 48s  | Pause     | Lunges       | ❌ Error |

*Cells with red background contain incorrect predictions. Rows with a black background and bold text are latest exercises of each kind in a row.*

!!! note "Pattern Recognition"
    In this example above you see that it's very unlikely that the user made a couple of lunge reps while doing squats all the time (rows #6, 9, 11), as well as made a pause or squats multiple times while doing lunges (rows #24, 26, 29). The row #21 tells us lunges were detected too early in comparison to ground truth.

### The Complexity Challenge

Of course, there are exceptions possible and people can do exercises in any order and sequence they want which makes the problem of detecting outlying (and most likely incorrect predictions) **hardly solvable at all**.

I made an educated guess, however, and decided to design an algorithm which will detect and remove outlying predictions from an array of all predictions for the given workout session.

## No Single Pattern to Detect

When talking about any human activity it's tremendously hard to pick out patterns that will repeat from user to user. **All people are unique** and each of them doing their workouts differently.

I had very hard times deriving the rules for this outlying predictions detection algorithm because the variability of what to consider an outlying prediction is really overwhelming. But having the ground truth predictions I could detect the most common patterns for detecting outliers and came up with following rules:

### Outlier Detection Rules

1. **If a current prediction is the same as next one** → do nothing
2. **If a current prediction is the same as previous one** → do nothing  
3. **If both previous and next predictions are not equal to current one** → use the previous prediction

### Algorithm Results

See how it helped to eliminate red spots in rows #6, 9, 21, 24, 26 after a **single algorithm execution**:

*[Results visualization after first pass]*

The outliers removal algorithm, however, introduced another red spot in row #10 and didn't solve an issue in #11 either, therefore I decided to apply the same algorithm **multiple times**.

### Multiple Pass Strategy

By experimenting with the exercise patterns I had I found that **3 algorithm passes** on "raw" predictions produced by the voting algorithm are enough to:

- Remove the majority of outliers
- Keep resulting predictions as close as possible to ground truth

### Quantitative Validation

To gain even more confidence in the algorithm, I conducted a test which simultaneously compared a standard deviation from ground truth of predictions to which only voting algorithm was applied and those which were obtained after 3 passes of outliers detection algorithm:

| Method | Standard Deviation |
|--------|--------------------|
| **Raw predictions** (voting only) | 15.41 |
| **After outlier detection** (3 passes) | 8.09 |

!!! success "Significant Improvement"
    An almost **2X improvement** in prediction accuracy, not bad!

## Conclusion

Of course, there are corner cases where outliers detection algorithm introduces distortions to the original data making one or other exercise to last a couple of seconds longer but nevertheless, it does a good job of making workout statistics look adequate in the cases where classifiers don't provide enough accuracy.

### Key Takeaways

- **The voting algorithm** is an essential addition to the classification pipeline, as no single classifier can provide near ideal accuracy in detecting fitness exercises
- **Outlier detection** through temporal consistency checks significantly improves prediction quality
- **Multiple algorithm passes** can progressively clean up prediction errors

Those two approaches allowed **AutoWorkout app** to more accurately detect motion activity and provide a better user experience.

## What's Next?

Follow me on **Medium** and **Twitter** to see how AutoWorkout app learned to count exercise reps using machine learning.

### Future Enhancements

Potential improvements for motion activity classification:

- **Personalized models**: Adapt to individual movement patterns
- **Context awareness**: Use workout type to inform predictions  
- **Temporal modeling**: LSTM networks for sequence prediction
- **Confidence scoring**: Reliability metrics for each prediction

--8<-- "work-with-me-cta.md"

--8<-- "linkedin-cta.md"