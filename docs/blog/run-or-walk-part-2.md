---
title: "Run or Walk (Part 2): Collecting Device Motion Data the Right Way"
date:
  created: 2017-08-14
description: Deep dive into proper data collection techniques for motion activity detection. Learn sensor selection, data frequency optimization, collection methodology, and how to avoid common data quality pitfalls when building machine learning datasets.
keywords: data collection, motion sensors, accelerometer, gyroscope, sensor data, machine learning datasets, iOS development, data quality, sensor frequency, motion detection
tags:
  - machine-learning
  - ios
  - data-collection
  - motion-sensors
---

# Run or Walk (Part 2): Collecting Device Motion Data the Right Way

!!! info "Series Navigation"
    Read previous part: [Run or Walk (Part 1): Detecting Motion Data Activity with Machine Learning and Core ML](run-or-walk-part-1.md)

## The Challenge of Data Collection

Being motivated to develop a machine learning model that accurately predicts whether the user walks or runs, I needed data. A quick search for the publicly available datasets which contain such activities gave no results. And the only option left was to collect data on my own.

Everyone who took part in any data science competitions knows that dataset always needs to be processed to some extent before it can be fed into machine learning model. You can't pass by this phase, otherwise, your model will suffer from:

- Missing data
- Skewed data  
- Outliers
- Several other issues

!!! tip "Data Processing Reality"
    Sometimes after finishing a competition and looking back to the time invested in it, you realize that nearly a half amount of your efforts were spent on processing a dataset! The reason? Datasets are based on the real-life data which is not ideal in a sense of continuity, homogeneity or statistical distribution.

## DIY Data Collection

Things are better when you are solely responsible for collecting the data. It's the most expensive way of getting data from the one side, but from the other side, you have a good chance to save yourself future efforts by collecting data in the way you need. Thinking carefully about the basics of the problem you're trying to solve helps to find a proper approach to collecting data.

### Finding the Right Position

I started from the essentials. If I wanted to know whether the person runs or walks I first needed to find a place on human's body where each of these activities could be clearly distinguished in terms of sensor data. 

Simply put the iPhone in the pocket and collecting the data from there is not a good solution because each time the device can be differently positioned there. This could result in too variable results from the sensors even for the same activity. Given a limited amount of time I had to collect data, I preferred to sacrifice data variability for the simplicity.

### Why the Wrist?

A perfect candidate for collecting people activity data is a **hand wrist**. And here's why:

- **Walking**: hand wrist directed to the ground, moves with low to medium velocity
- **Running**: hand wrist directed mostly perpendicular to the ground, moves with medium to high velocity

Considering most people have two hand wrists, the data for my 2-class classification model should be collected in following variations:

1. Walking, right wrist
2. Walking, left wrist  
3. Running, right wrist
4. Running, left wrist

!!! question "Why iPhone Instead of Apple Watch?"
    A valid question here would be "Wait, why mounting an iPhone on your wrist when Apple Watch is a more appropriate choice?!" Totally agree, but by that time I didn't own one and assumed iPhone with its accelerometer and gyroscope will deliver equivalent sensor data.

**Important setup detail**: iPhone was always positioned with Home button pointing to the fingers.

## What Data to Collect?

What first seems an easy to answer question, can lead you in the wrong direction. Having accelerometer, gyroscope, magnetometer, pedometer and even barometer in your iPhone doesn't mean that collecting sensor data from all of them makes sense.

The good starting point here is an official documentation which reveals the capabilities and limitations of each sensor. After carefully reading it I realized that the most valuable data comes from **2 sensors: accelerometer and gyroscope**. Remember, I wanted to use as fewer data as possible? Limiting the number of sensors is the first step in this direction.

### Why These Two Sensors?

- **Accelerometer**: provides changes in device's velocity along 3 axes which is a crucial piece of information about how one moves his hand
- **Gyroscope**: delivers the rate at which a device rotates around a spatial axis which carries probably fewer insights for distinguishing running and walking activities, but, might still be helpful

*Sensor axes for accelerometer (left) and gyroscope (right)*

## Raw vs Processed Data

Apple made a very good job providing different formats of motion data for different occasions. If one needs the accelerometer data limited to acceleration which was applied to the device only by the user, processed data is a valid option in this case. It doesn't include different forms of bias like the acceleration caused by the gravity.

From the other side, **raw accelerometer data** leaves it up to you how you process it, if at all. This kind of data is the perfect candidate to be used in my future machine learning model. 

### Why Raw Data?

Being unprocessed means that the data is:

- Free from any form of bias caused by implementation details of processing algorithms in iOS
- Potentially reusable on other platforms  
- Lower risk of getting hardly identifiable issues when training the model

## Sensor Update Frequency

Depending on hardware, Apple states impressive **"at least 100 Hz"** of a maximum sensor update frequency for accelerometer and gyroscope. It's obvious: the more detailed information about device movement you need, the higher should be this value. But there is always some threshold when you get detailed enough data and getting even more detailed measurements don't make sense.

### Finding Optimal Frequency

How to find an optimal sensor update frequency? Collect equivalent activity data at:

1. Maximum possible frequency
2. 70% of this value
3. 40% of this value  
4. 10% of this value

Plot the signal you received from each of those values and find a plot which keeps the important details of a signal and has the lowest sensor update frequency at the same time.

**Data collected at 50Hz**
*The same data downsampled to 30Hz. Important signal details are lost.*

!!! success "Optimal Frequency Found"
    After experimenting with several values I identified **50Hz** as an optimal sensor update frequency for the type of activities I was going to record.

## Collection Interval Strategy

Initially, I tried to collect data in an "uncontrolled" environment. I thought I will just stroll through the city on foot and endlessly record data for a walking activity. The same with running - I would just use my regular jogging sessions for data recording.

### The Problem with Continuous Recording

Reality showed, however, that continuous recording of activities in the real environment like cities, where your movement is constantly interrupted by intersections, traffic lights, and other people, is a very bad idea. 

Data obtained during 30-minutes long walking session is full of noise from interruptions. I made an attempt to apply a few technics for removing outlying data samples, but none of them gave me a confidence that I preserve original data characteristics.

### The Solution: Short Intervals

The solution was to drastically shorten data collection intervals. When I evaluated recorded sessions which lasted only **10 seconds**, I found out that only **3–4%** of them contained outliers. Compared to **45%** of data samples contained noise after continuous recording sessions, this is a clear improvement and a way to go.

## Data Collection App

I needed an app to collect data and temporarily store it before it'll be uploaded to the environment where the samples will be processed.

Staying pragmatic about the possible app features I refrained from developing fancy things and focused on the single goal - **reliably collect data with fixed intervals and store it inside the app**.

### App Requirements

The main questions regarding how often I want to collect data samples (50Hz) and for how long (10-second intervals) were answered. I had to implement an app which:

- Collects data samples
- Supplies them with meta information like:
  - Date and timestamp
  - Username  
  - Hand wrist on which a recording took place
- Stores recorded sessions in data recording app's container in `*.csv` format
- Allows extraction and copying to computer

### User Experience Features

Additionally, I implemented:

- **Haptic feedback** within regular time intervals to inform myself that recording still takes place and I don't waste time running somewhere without actually collecting data
- **Two recording modes**: manual and continuous (used the continuous mode 95% of the time)
- **Automatic session management**: didn't require me to start new recording session after every 10 seconds

*Simplest possible UI*

Depending on whether "Walking" or "Running" was tapped, collected data has been accordingly labeled in the resulting `*.csv` files.

## The Final Dataset

After collecting walking and running data for about **5 hours in total**, I could get an almost equal amount of data for each class including left/right wrist variations. This resulted in **88,588 data samples** with following structure:

!!! success "Dataset Validation"
    To prove that dataset I collected is robust and doesn't suffer from typical dataset problems, I uploaded it to Kaggle and let others review and analyze it. I made my own analysis as well to make sure I will not face hard-to-analyze issues when training machine learning model on this dataset.

The fact the dataset was **featured by Kaggle team** gave me confidence that the time spent recording this data worth it. And the biggest outcome, of course, is the fact that I could lose some weight during a couple of weeks when I was collecting the data.

## What's Next?

Follow me and stay tuned to know what machine learning techniques I applied to this dataset to predict user activity with **>99% accuracy**.

## Series Navigation

**Read next parts:**

- [Run or Walk (Part 3): >99% Accuracy Neural Network Classifier for Detecting Motion Activity](run-or-walk-part-3.md)
- [Run or Walk (Part 4): Using Keras Neural Network Classifier in iOS with Core ML](run-or-walk-part-4.md)

---

**Image/Video credits:**

- https://docs-assets.developer.apple.com/published/96e9d46b41/ab00c9d5-4f3d-475b-8020-95066068a18d.png
- https://docs-assets.developer.apple.com/published/96e9d46b41/c9b606b2-9a52-487e-8385-e710ffa1ce5f.png
- Videezy.com

--8<-- "linkedin-cta.md"