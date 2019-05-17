# PROJECT WEEK 2: Making my life as an acquisition manager so much better

In my day job, I run paid acquisition efforts at a small app publisher. My goal is to get the right message in front of the right potential users at the right time at the lowest possible cost. The margins in a business like this can be pretty tight, so it is of extreme importance to be very vigilant about spending and make sure that every dollar counts. 

In order to do this, we need to be advertising on as many ad networks as possible, and efficiently managing spend across all of these platforms. But the problem is, the important information I need to know is spread out in many places. Spend, impressions, views, and clicks come from the Ad Networks, and then Installs, Activations, Trial Starts, Subscriptions, Revenue, and various other engagement metrics come from us, the Publisher. We send most of this information to a 3rd party aggregator called an MMP (Mobile Measurement Partner) because they also have the special ability to verify where the installs came from.

## The Dilemma
We need a quick and easy way to combine the top funnel metrics provided by each individual ad network with the install attribution and post install mid/low funnel events. This way, we can make data driven decisions on a daily basis as to where to put our money, when to rotate creative, refresh audiences, or which channels to optimize.

Here's a diagram that attempts to explain the dilemma:
![Acquisition Managers Dilemma](https://github.com/EfficiencyJunky/UCB_DataBootcamp_Homework_repo/blob/master/13-Project_Week_2/Resources/acquisition_managers_dillemma.png?raw=true)


## The Data
Let's get a quick explanation of the above diagram, which ad networks we're talking about and what data they provide as well as a quick description of our Mobile Measurement Partner and what they provide.

**DATA SOURCE 1 -- The Ad Networks: Providing top of the funnel data**

To start the process of acquiring users, we give money to a variety of ad networks to advertise our app, which is available on Apple's AppStore as well as Google's Play Store:

 - Facebook
 - Pinterest
 - Google
 - Apple Search Ads
 - Snapchat (coming soon)

Each of these networks individually reports their top of the funnel metrics split out by Campaign/Ad-set/ad:

**Here's the essential data they each provide:**
 - Date
 - Spend
 - Reach/Impressions
 - Views (if applicable)
 - Clicks


**DATA SOURCE 2 -- Mobile Measurement Partner: Providing Mid/Lower-funnel data**

Once the user clicks on an ad, they are taken to their respective app store (Apple's AppStore or Google's Play Store), and at this point, they have left the ad network's domain. Once they download the app and install it, we need to know which ad network to attribute the install and subsequent user events to. And then anything that isn't attributed to an ad-network needs to be counted as "Organic".
In order to do this, we have to use a special service called a Mobile Measurement Partner. They are an unbiased 3rd party that checks in with each ad network and verifies who gets credit for the install. We also send the MMP data on other important events so they can attribute these to the right ad network as well.

**Here's the data they gather:**

 - 	Ad Network
 - Campaign/ad-set/ad Name
 - Date
 - Installs
 - Sessions (app launches)
 - Activations
 - Trial starts
 - Revenue events and revenue


## PUTTING IT ALL TOGETHER
With the above data we can essentially gain a complete understanding of where to put our money or what optimizations to make. But how do we combine it all together when it's all in different places and formatted differently by each advertiser?

### EXTRACTION!!!
The first step is to get all of the data in one place. To get the data from the ad-networks, I first build a report with all of the relevant columns of information on each ad-network and have that sent to my inbox each morning. Keep in mind each ad-network has a different way of delivering this information (columns, rows, naming conventions etc) So that means we have to extract one CSV in a different format for each Ad-Network.

**LIST OF RAW DATA CSV FILES**
 - Facebook
 - Pinterest
 - Google
 - AppsFlyer IOS
 - AppsFlyer Android
 - NOTE: Apple Search Ads don't really provide a data report, but they send some of the spending data to our MMP so we just rely on that as our source of Spending data for Apple Search Ads

### TRANSFORMATION!!!
This is the meat and potatoes of solving this problem. The goal is to get all of the ad networks data into the same format and add some columns of information specific to our advertising interests, then from the MMP only take the useful information from their CSV and prepare it so it can be easily combined with the ad networks whenever we decide we want to do that.

**STARTING WITH THE AD NETWORKS**
We need to transform the information from each ad network CSV into a single simplified set of columns (some of the ad networks provide a ton of columns we don't need in their report) and add a couple columns that include tags that let us know what type of campaign each dollar was spent on, what OS the campaigns were targeting and make it easier to combine with the data from the MMP. 
We also need to separate the data into two data-sets for each ad network based on the OS the campaigns were targeting. One dataframe with the top of funnel metrics for Android, and one with top of funnel metrics for IOS

So in the end we have 6 clean data frames from the advertisers:
 - Facebook IOS 
 - Facebook ANDROID 
 - Pinterest IOS 
 - Pinterest ANDDROID 
 - Google IOS 
 - Google ANDROID

**Each ad network's dataframe will be transformed into this format:**
![enter image description here](https://github.com/EfficiencyJunky/UCB_DataBootcamp_Homework_repo/blob/master/13-Project_Week_2/Resources/transform-facebook.png?raw=true)


**NOW FOR THE MMP**
Thankfully, the MMP already provides a separate CSV for iOS and ANDROID, but they also include a ton of extra columns of information that we don't need. So the transformation of each MMP data set needs to remove these columns, and add the same "campaign_type" column that we added to the ad networks' data frames so that we can combine them together in a groupby using this extra column.
![enter image description here](https://github.com/EfficiencyJunky/UCB_DataBootcamp_Homework_repo/blob/master/13-Project_Week_2/Resources/transform-appsflyer.png?raw=true)

**WHAT ABOUT ORGANICS AND APPLE SEARCH ADS?**
Since we don't have the Ad network data for Organics (obviously) and the same goes for Apple Search Ads (because apple is just like that) we have to create placeholder "spoof" data frames for each of these sources in place of the ad network data frame. This way, we can properly combine all of the sources together with the MMP data and the Organics and Apple Search Ads will just have "NaN" for the top-funnel metrics that we aren't able to get for them
![enter image description here](https://github.com/EfficiencyJunky/UCB_DataBootcamp_Homework_repo/blob/master/13-Project_Week_2/Resources/transform-organic_asa.png?raw=true)


### LOADING!!!
Now for the easy part! Essentially we just need to set up our Database schema to accept the prepared information in all of the dataframes.

<!--stackedit_data:
eyJoaXN0b3J5IjpbMTE5NTk1NDg0LC0xMzM0NjQ1NzY4LDY2MT
UwMjAzMiwtMzk5NTE4NTk3LC0xMDgwOTM4MTI4XX0=
-->