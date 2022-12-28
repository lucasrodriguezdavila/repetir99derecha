# [Space Apps 2022 Challenge](https://2022.spaceappschallenge.org/challenges/2022-challenges/track-the-iss/details) - Where ISS

> [See it live!](https://whereiss.earth/)

Where ISS is a web application that allows to observe the globe and the route of the ISS live. In addition to interesting data and images from the satellite cameras.

## This proposal brings:

* Simple visualization form.
* Interactive and easy distribution of information.
* Prediction and past locations (up to 3 days) to see the ISS in real time.
* Obervation data of when the ISS will be visible in a chosen location.
* Tracking view of ISS followed by some information and curiosities and live feed provided by the station
* Scalable format for extending and nucleating other current NASA projects.

Extracting the data from [CelesTrack](https://celestrak.org/), trajectories are calculated using the Two-line element set and the sgp4 propagation prediction algorithm to know the trajectory of the satellite over time. This information is then translated into different types of coordinates to make the necessary projections around the earth. 

![whereIss](https://user-images.githubusercontent.com/62041766/193491894-a7fbcc8b-cd37-4323-bb62-f671fde316bf.jpg)
