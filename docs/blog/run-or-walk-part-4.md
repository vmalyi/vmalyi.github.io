---
title: "Run or Walk (Part 4): Using Keras Neural Network Classifier in iOS With Core ML"
date:
  created: 2017-11-14
description: The final part of the series showing how to convert trained Keras models to Core ML format and integrate them into iOS applications for real-time motion activity detection. Complete guide from model serialization to iOS deployment.
keywords: Core ML, iOS development, Keras, model deployment, mobile machine learning, Swift, iOS app development, model conversion, real-time inference, on-device ML
tags:
  - machine-learning
  - ios
  - core-ml
  - keras
  - neural-networks
---

# Run or Walk (Part 4): Using Keras Neural Network Classifier in iOS With Core ML

!!! info "Series Navigation"
    **Read previous parts:**
    
    - [Run or Walk (Part 1): Detecting Motion Data Activity with Machine Learning and Core ML](run-or-walk-part-1.md)
    - [Run or Walk (Part 2): Collecting Device Motion Data the Right Way](run-or-walk-part-2.md)
    - [Run or Walk (Part 3): >99% Accuracy Neural Network Classifier for Detecting Motion Activity](run-or-walk-part-3.md)

## Introduction

Finally, I got to the final step of this journey. Now it's time to utilize the model we trained in Part 3 inside the iOS application which predicts user motion activity.

## Save Keras Model

First of all, I had to serialize my trained model to JSON and save its weights.

Keras provides a straightforward API to achieve this:

```python
# Serialize model to JSON
model_json = model.to_json()
with open("model.json", "w") as json_file:
    json_file.write(model_json)
```

The same easy way one can save model's weights to `*.h5` file on disk:

```python
# Serialize weights to HDF5
model.save_weights("model.h5")
print("Saved model to disk")
```

## Convert Keras Model to Core ML

Now it's time to convert my saved model to Core ML format. Since I have a Keras model neural network, I can use **Apple's Core ML Tools Python package** which does the job converting the model for me:

```python
import coremltools

# Convert the model
coreml_model = coremltools.converters.keras.convert(
    'model.json',
    weights_path='model.h5',
    input_names=['accel_x_input'],
    output_names=['activity_output'],
    class_labels=['walking', 'running'],
    predicted_feature_name='activity'
)

# Set model metadata
coreml_model.short_description = 'Classifies motion activity based on accelerometer data'
coreml_model.input_description['accel_x_input'] = 'Accelerometer X-axis data over 2 seconds'
coreml_model.output_description['activity_output'] = 'Predicted activity type'

# Save the Core ML model
coreml_model.save('AccelXModel.mlmodel')
```

## Use Converted Core ML Model in iOS App

Importing Core ML model to my iOS app was as easy as **drag & drop** it to Xcode project. The values I just used for setting model's metadata, input and output description are now visible in the Core ML model's window in Xcode.

*Core ML model window in Xcode*

Since Xcode has automatically generated a custom API for imported `accel_x_model` Core ML model, I'm ready to go with feeding the model with sensor data and reading its predictions.

### iOS Implementation

```swift
import CoreML
import CoreMotion

class MotionActivityPredictor {
    private let model = AccelXModel()
    private let motionManager = CMMotionManager()
    private var sensorData: [Double] = []
    
    func startPredicting() {
        guard motionManager.isAccelerometerAvailable else { return }
        
        motionManager.accelerometerUpdateInterval = 1.0 / 50.0 // 50Hz
        motionManager.startAccelerometerUpdates(to: .main) { [weak self] data, error in
            guard let acceleration = data?.acceleration else { return }
            
            self?.processSensorData(x: acceleration.x, y: acceleration.y, z: acceleration.z)
        }
    }
    
    private func processSensorData(x: Double, y: Double, z: Double) {
        sensorData.append(x) // Using X-axis for this example
        
        // Keep only last 12 samples (2 seconds at 50Hz)
        if sensorData.count > 12 {
            sensorData.removeFirst()
        }
        
        if sensorData.count == 12 {
            predictActivity()
        }
    }
    
    private func predictActivity() {
        do {
            let input = AccelXModelInput(accel_x_input: sensorData)
            let prediction = try model.prediction(input: input)
            
            print("Predicted activity: \(prediction.activity)")
            print("Confidence: \(prediction.activityProbability)")
            
        } catch {
            print("Error making prediction: \(error)")
        }
    }
}
```

!!! note "Real-time Processing"
    The implementation collects accelerometer data at 50Hz, maintains a sliding window of 12 samples (2 seconds), and makes predictions in real-time as new data becomes available.

## Finish Line

It was really cool to see how the idea of detecting motion data activity evolved to such an interesting project requiring me not only learning new things about machine learning and its application in iOS with Core ML but also giving a chance to **lose a couple of kilos** when collecting data for the model.

*iOS app detects motion activity in real time*

### Key Achievements

✅ **End-to-end machine learning pipeline**: From data collection to iOS deployment  
✅ **High accuracy model**: >99% accuracy on motion classification  
✅ **Real-time inference**: On-device prediction using Core ML  
✅ **Practical application**: Working iOS app with motion detection  

!!! success "The Power of Core ML"
    It's amazing what new possibilities there are with such an easy way to apply machine learning in mobile applications as Apple's Core ML!

## Series Summary

This 4-part series covered the complete journey of building a motion activity classifier:

1. **Part 1**: Introduction and problem definition
2. **Part 2**: Data collection methodology and best practices  
3. **Part 3**: Neural network design and training for >99% accuracy
4. **Part 4**: iOS integration using Core ML

### Lessons Learned

- **Data quality matters more than quantity**: Short, clean intervals beat long, noisy recordings
- **Sensor selection is crucial**: Accelerometer + gyroscope provided sufficient signal
- **Model architecture can be simple**: 3 hidden layers achieved excellent results
- **Core ML makes deployment trivial**: Drag-and-drop integration into iOS apps

## What's Next?

Follow me to get updated on my latest experiments with **machine learning and iOS**!

### Future Improvements

Potential enhancements to explore:

- **Multi-activity classification**: Expand beyond walking/running
- **Apple Watch integration**: Leverage dedicated wearable sensors  
- **Personalization**: Adapt models to individual movement patterns
- **Energy optimization**: Reduce battery consumption during inference