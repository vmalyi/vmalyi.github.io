---
title: "Run or Walk (Part 1): Detecting Motion Activity Type With Machine Learning and Core ML"
date:
  created: 2017-08-05
description: Introduction to building an end-to-end motion activity detection system using machine learning and Apple's Core ML framework. Learn how to distinguish between walking and running using iOS device sensors and explore the foundations of on-device machine learning.
keywords: Core ML, machine learning, iOS development, motion detection, accelerometer, gyroscope, neural networks, Apple WWDC, device sensors, activity recognition
tags:
  - machine-learning
  - ios
  - core-ml
  - deep-learning
  - motion-detection
---

# Run or Walk (Part 1): Detecting Motion Activity Type With Machine Learning and Core ML

!!! info "Series Introduction"
    This is the first part of a 4-part series exploring how to build a machine learning model that can detect whether a person is walking or running using iOS device sensors and Core ML.

## Introduction

There were a lot of announcements during recent Apple WWDC conference in June. One of the most remarkable is the release of **Core ML framework** that provides on-device machine learning capabilities to every developer. And this is revolutionary.

Revolutionary means that earlier, the one who wanted to use any somewhat modern machine learning model in their app had only choices which are not straightforward to configure and implement. And Core ML became exactly that only option to use ML model in your application in "drag and drop" manner. iOS does the most of the heavy lifting to generate interfaces which represent the model itself, its inputs and outputs.

## The Opportunity

This opened everyone an opportunity to implement an **end-to-end solution**: from collecting data and training the model up to utilizing this model in the iOS app.

With this prospect, the idea which I already had for a long time - *automated detection of sports activities* - became reality. I decided to prove a hypothesis that a pre-trained machine learning model built into an iOS app can classify whether the person runs or walks based on the data from **accelerometer and gyroscope**.

!!! note "Scope of the Project"
    Of course, there are way more other sports activities which can be detected in an automated way, but for the first attempt, I took those which should be clearly distinguishable from people's point of view as well as from the data received from sensors.

## Data Visualization Examples

The following shows how accelerometer data differs between walking and running:

- **Accelerometer data when the person is walking**
- **Accelerometer data when the person is running**

## Existing Solutions Analysis

When investigating what similar tools are already available on iOS for this purpose, I found out that `CMMotionActivity` object of a `CMMotionActivityManager` class can detect whether the device is on the walking or running person, or that device is in an automobile or even is on a bicycle.

From the first look it seemed that this problem is already solved, but after digging deeper into the documentation I realized that **Apple's Core Motion uses data from a wide range of input sources** including:

- Accelerometer
- Gyroscope  
- Magnetometer
- Pedometer

## Research Questions

Can one predict whether the person is walking or running using only the fraction of the sensor data available? And how accurately? Will any machine learning model be able to master this task? And, finally, will it be possible to use that model in my iOS app later?

These are the main questions I will find answers to in the series of blog posts during the next several weeks.

## What's Coming Next

Follow me to see what challenges I faced while:

- Collecting training data
- Designing, training and tuning the high-accuracy machine learning model
- Building it into the iOS app

## Series Navigation

**Read next parts:**

- [Run or Walk (Part 2): Collecting Device Motion Data the Right Way](run-or-walk-part-2.md)
- [Run or Walk (Part 3): >99% Accuracy Neural Network Classifier for Detecting Motion Activity](run-or-walk-part-3.md)
- [Run or Walk (Part 4): Using Keras Neural Network Classifier in iOS with Core ML](run-or-walk-part-4.md)

--8<-- "work-with-me-cta.md"

--8<-- "linkedin-cta.md"