---
title: "Run or Walk (Part 3): >99% Accuracy Neural Network Classifier for Detecting Motion Activity"
date:
  created: 2017-09-05
description: Designing and training neural network architectures that achieve over 99% accuracy in motion activity detection. Learn model architecture decisions, hyperparameter tuning, validation techniques, and how to optimize deep learning for mobile applications.
keywords: neural networks, deep learning, motion classification, Keras, TensorFlow, model architecture, hyperparameter tuning, cross-validation, accuracy optimization, feedforward networks
tags:
  - machine-learning
  - neural-networks
  - motion-classification
  - accuracy-optimization
---

# Run or Walk (Part 3): >99% Accuracy Neural Network Classifier for Detecting Motion Activity

!!! info "Series Navigation"
    **Read previous parts:**
    
    - [Run or Walk (Part 1): Detecting Motion Data Activity with Machine Learning and Core ML](run-or-walk-part-1.md)
    - [Run or Walk (Part 2): Collecting Device Motion Data the Right Way](run-or-walk-part-2.md)

## Introduction

After collecting a solid amount of walking and running data in the previous part, I was ready to go further and make use of it. My goal was to design and train a machine learning model which accurately predicts the type of user activity based on this data.

## Framework and Model Selection

Thinking about what machine learning framework to choose for this task, I referred to the list of frameworks supported by **Core ML**. This dramatically narrowed the list of the candidates, since only a few of them are natively supported.

Everyone who tries to solve a problem with machine learning faces the challenge of variety. A variety of models the one can use is vast. Selecting the most appropriate one is critical because usually, you have time and resources to evaluate only a couple of them, not all.

### Why Neural Networks?

The hype around a deep learning is huge these days and you can't ignore it when thinking about the perfect model for your project. Well, probably I won't need a really deep neural network to solve this problem - I thought - but at least it'll be a move in the right direction. **"Shallow" artificial neural networks** are also known for their efficiency in solving multiclass classification problems.

### Framework Choice: Keras + TensorFlow

Considering the fact that feed-forward neural networks in Core ML are supported only by **Keras framework**, my choice was straightforward. This framework is designed with a focus for rapid experimenting and can be used on top of:

- TensorFlow
- CNTK  
- Theano

Therefore, was a perfect option for me. I selected **TensorFlow backend** for Keras as the one I already made some experiences with and was comfortable understanding its concepts.

!!! success "Development Experience"
    Saying in advance about my adventure working with such setup, I can confirm that it allowed me to experiment fast and made myself concentrate on design and not the implementation of the model.

## Model Architecture: Input Layer

In feedforward neural networks everything starts from the input layer. It was a time to take a break and look at my data again so that I can define the number of input neurons in the input layer.

Initial format of my dataset was following:

*[Dataset structure visualization]*

### The Time Series Challenge

This was a good time point to think about how it's theoretically possible to predict the type of motion activity based on sensor data? It's not feasible to do based on a single sample, but taking into account multiple data samples will make it achievable to detect a pattern.

**How much time does an average human need to make a single natural wrist movement when walking or running?** Between 1 and 2 seconds. Considering this, training data has been collected with ~5Hz frequency, I needed only to select ~10 samples for each learning iteration. That would give me a 10 by 6 matrix as an input for my neural network.

### Input Layer Limitation

This is, however, not acceptable, since an input layer of a feedforward neural network must be a **column matrix** and not an m by n matrix. It meant that the idea of combining data from all sensors in a single learning iteration was not achievable and, so, I had to use **6 models**: for 2 sensors * 3 axes each.

When using those models for predicting motion activity types, I could apply **ensembling techniques** to evaluate their output and generate a single prediction.

### Data Transformation

This approach required me to transform my initial dataset into **6 separate ones** - each representing an axis either of accelerometer or gyroscope and containing **12 sensor samples** (~2 sec. observation time) per row. This "magic number" was derived from numerous experiments on the latter stages, where I tried to find a balance between model accuracy and the number of its inputs.

*The format of one of the final datasets: rows represent continuous sensor measurements equivalent to ~2 sec. of observation. Column 'y' represents a label for each row.*

## Model Architecture: Hidden Layers

I decided to start with a neural network containing only **1 hidden layer**, evaluate its performance and move further adding additional hidden layers if needed. Such approach of starting with a basic model and then gradually adding complexity guaranteed me the absence of hard-to-identify issues when I was training the model.

### Layer-by-Layer Results

- **1 hidden layer**: 92.5% accuracy
- **2 hidden layers**: 97.2% accuracy  
- **3 hidden layers**: 99.2% accuracy
- **4+ hidden layers**: either no effect on accuracy or reduced it

!!! note "Cross-Validation"
    I used **10-fold cross-validation** on test data here and in all further experiments to derive accuracy numbers.

It's arguable, whether such a neural network can be considered a "deep" one, but most importantly I was able to find an optimal number of hidden layers.

## Model Architecture: Other Hyperparameters

There were few other hyperparameters available which I tried to tweak with help of **grid search**:

- Number of neurons in hidden layers
- Their activation functions

### Optimal Configuration

The search procedure showed that the highest prediction accuracy had a network with:

- **15 neurons** in each hidden layer
- **Rectified Linear Unit (ReLU)** activation function

### Loss Function and Optimizer

- **Loss function**: Categorical cross-entropy loss function for its ability to increase a network's learning speed independently of defined learning rate
- **Optimizer**: ADAM optimizer for computational efficiency and delivering adequate results for the kind of problem I was trying to solve

## Significantly Less Data, Almost the Same Accuracy

When I was ready with the architecture of my neural network, I wanted to prove hypothesis about where lays the lower limit of the data amount the network needs to perform accurately.

By data amount, I understand the number of data samples fed into the network when predicting a single example. Remember, I mentioned a number of 12 (~2 seconds of observation)? I selected this number by comparing network's accuracy when using lower and higher amount of data:

| Samples | Observation Time | Accuracy |
|---------|------------------|----------|
| 17      | ~3.4 seconds    | 99.32%   |
| 12      | ~2.4 seconds    | 99.23%   |
| 6       | ~1.2 seconds    | 97.93%   |

!!! tip "Optimal Balance"
    Even when 12 samples option has a minimally lower accuracy than 17, it greatly reduces the amount of input data consumed by the network, so, drops the amount of computation power needed to train it. Impressively, 6 samples per prediction (~1 sec. of observation) allow the neural network to perform quite accurately as well!

I decided to stick to **12 samples** since it gives the model more data to generalize better, and, additionally, allowed me to have a dataset of **7,387 examples** out of total 37,777 data samples for each sensor/axis.

## Proving Additional Hypotheses

### Different Wrist, No Training Data

What if I would have collected all my training data solely on one wrist, trained my model on it and then asked it to predict activity type from the other wrist? An interesting question I spent little time to find an answer to.

**Result**: The neural network is able to predict a correct activity only in **91%** of all cases. 

!!! note "Cross-Wrist Performance"
    Well, not a tremendous result, but it still shows how well a relatively simple neural network could detect patterns in data regardless of its sign!

### Low Predictability of Gyroscope's Axis Y

A model trained exclusively on data from gyroscope's axis Y has **"only" 85%** prediction accuracy. This proves that this axis doesn't contribute a lot to an overall accuracy when one tries to predict either walking or running.

**Interpretation**: Human's hand wrist doesn't make movements reflecting in strong patterns around this axis. Or at least I move my hands in the way that it leaves no chance for gyroscope's axis Y to be used for reliable predictions.

## Results from Other People

I got interesting insights from contributors on **Kaggle**, who played with my full dataset: whatever model or approach they used, the accuracy was always top!

### A Critical Learning

After deeper looked at their implementations, I realized that all of them fed the dataset "as is" into their models while training - **sample by sample**, without comprehending that a single sample in time-series data worth nothing in terms of detecting patterns in the whole series.

!!! warning "Time Series Data Handling"
    A dataset which should have been used may look similar to this one.
    
    It was a good reminder to not attack a problem without spending the time to understand its basics.

## What's Next?

If you're interested in how the model described in this post looks in the real world, you can find it on **Kaggle**.

Stay tuned for last article in this series, where I show how the neural network has been imported and used in the iOS app with help of Core ML.

## Series Navigation

**Read next part:**

- [Run or Walk (Part 4): Using Keras Neural Network Classifier in iOS with Core ML](run-or-walk-part-4.md)