# NYUAD Orchestra Logo Demo

Last semester, I heard how the NYUAD Orchestra is looking for an interactive logo, and grabbing this opportunity, I thought I could create a potentially impactful class project. The idea was to create a Google Doodle-like logo that uses machine learning and computer vision to make the logo interact with the user. Since it is a logo for an orchestra I taught the best would be if I create a game where swinging with your hands as if you were conducting makes the logo move. 

## Getting started

Clone the project from Github, and install express in the project folder

```
npm install express
```

The run the server

```
node server.js
```

Navigate to localhost:8080, allow webcamera access, scroll to the bottom of the page. There you find the machine elarning dashboard for training and running. To run, click load (to load a previously trained model) then click run. You're good to go.

## Components 
* node.js
* ml.js
* tone.js
* p5.js
* orchestra sounds from the Professor
* Images from google

## Contributing

Please feel free to reach out to me, if you would like to continue to develop the logo. It is a great service to our school.


## Authors

* **Gabor Csapo** - gabor.csapo@nyu.edu


## Documentation
Last semester, I heard how the NYUAD Orchestra is looking for an interactive logo, and grabbing this opportunity, I thought I could create a potentially impactful class project. The idea was to create a Google Doodle-like logo that uses machine learning and computer vision to make the logo interact with the user. Since it is a logo for an orchestra I taught the best would be if I create a game where swinging with your hands as if you were conducting makes the logo move.

The goal and the medium (webpage) were both set, and now I had to look for libraries that would allow me to realize my plan. The inspiration for the computer vision algorithms came from the research I was doing for my original idea to create a weight estimator. I was first thinking about utilizing an optical flow demo. However, after an initial test in Processing, I had to realize that in order to create the desired interaction, I needed the absolute position of the hand, not relative change. This lead me to experiment with the image difference algorithm. If I sum the differences along the horizontal axis, it provides a fairly lightweight feature to train an ml model on that would smooth the estimated position of the hand. Luckily, there is an image difference demo in p5, so the web medium isn’t posing any issue. On the other hand, machine learning in the browser gave me some headache. Machine learning is near non-existent in javascript, with some notable deep learning exception, but what I needed was a simple regression and classification model, which was difficult to find. I came across ML.JS, probably the only well supported machine learning library in javascript, and decided to try its SVM, KNN, and some regression model, ultimate the KNN and a polynomial regression model gave me the best results. From there, the project was mostly coding, and fine tuning the features, which proved surprisingly difficult.

For user testing, I was able to showcase my near complete project. Everybody in class got a chance to try my logo, and the feedback was very positive. I realized the slight unpredictability in machine learning is actually a huge positive feature. Students really enjoyed being the conductor, and I feel like it would be a successful logo on the real website making people smile every time they get a chance to play. As a result of the user testing I realized, people should be able to see themselves, so I put the camera feed next to the logo. The website also needed some textual instructions so I took put a little cartoon and text in the corner prompting people to start conducting. Since it is still merely a demo, I thought it didn’t make sense to start the algorithm straight away, so the user has to first scroll down, click ‘Load’, which loads the model and ‘Run’ which starts moving the logo around. 
[![Alt text](http://i3.ytimg.com/vi/hhVAQLKRq88/maxresdefault.jpg)](https://www.youtube.com/watch?v=hhVAQLKRq88&feature=youtu.be)

The single most important learning outcome from this project, is the mindset shift about the usefulness of machine learning that I had during the project. It was eye opening to experience how machine learning can guess rules, and patterns that would take hours to hard code and debug. In the future, I will definitely make more use of machine learning in interaction projects.