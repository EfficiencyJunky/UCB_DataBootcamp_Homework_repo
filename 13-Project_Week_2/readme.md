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

**COMBINE THEM TOGETHER INTO SEPARATE IOS AND ANDROID DATAFRAMES**
Now that we've nicely formatted all of our dataframes from each advertiser to have the same structure and separated them by operating system (IOS and ANDROID) all we have to do is combine all of the individual advertiser dataframes for each OS.
The result is two dataframes (one for IOS and one for ANDROID) with all the top funnel metrics tagged by advertiser and campaign_type! WOOT!

**So our final set of data frames looks like this**
 - All advertiser top funnel metrics for IOS
 - All advertiser top funnel metrics for ANDROID
 - MMP cleaned mid/low funnel metrics for IOS
 - MMP cleaned mid/low funnel metrics for IOS

### LOADING!!!
Now for the easy part! We just set up our Database schema to accept the prepared information for the 4 dataframes listed above!

Each ad network table needs to have the following columns:
 - date DATE NOT NULL,   
 - device_type TEXT NOT NULL,   
 - advertiser TEXT NOT NULL,   
 - campaign_type TEXT NOT NULL,   
 - spend FLOAT,   
 - impressions INT,   
 - impressions_unique INT,   
 - clicks INT,   
 - clicks_unique INT,  
 - views INT

Each MMP table needs to have the following columns:
 - date DATE NOT NULL,
 - advertiser TEXT NOT NULL,
 - campaign_type TEXT NOT NULL,
 - installs INT,
 - sessions INT,
 - new_workout_saved_unique INT,
 - af_purchase_unique INT,
 - af_purchase_all INT,
 - af_start_trial_unique INT,
 - af_start_trial_all INT,
 - trial_starts_unique INT,
 - trial_starts_all INT,
 - ltv_subs_unique INT,
 - ltv_subs_all INT,
 - ltv_subs_revenue FLOAT

Once the database is created and tables set up, we just simply load the data using SQL Alchemy commands.


## PLAYING WITH THE DATA -- GAINING ACTIONABLE INSIGHTS
Now comes the fun part! We get to play with all our nicely formatted and centralized database of awesomeness!

There are a million ways we could use this data to tell stories and draw actionable insights, but I'll keep it simple and outline one simple usecase.

The daily / weekly report of Spend, Installs, Trial Starts, and the Cost Per Install and Cost Per Trial Start broken out by each ad network and campaign_type.

This set of information is paramount to understanding what bid-caps we need to set on each campaign of each ad network in order to ensure we aren't spending more money than we are making and run a very efficient and lean business.

In order to get the above information, we only need to run one simple query that looks like this:

    SELECT advertiser, campaign_type, tot_spend, tot_installs, tot_spend/tot_installs as CPI, tot_trials, tot_spend/tot_trials as CPT
    FROM
    (
    	SELECT ads.advertiser as advertiser, ads.campaign_type as campaign_type, sum(ads.spend) as tot_spend, sum(ads.impressions) as tot_impressions, sum(ads.clicks) as tot_clicks, 
    		sum(aps.installs) as tot_installs, 
    		sum(aps.sessions) as tot_sessions, 
    		sum(aps.new_workout_saved_unique) as tot_workouts, 
    		-- aps.af_purchase_unique,
    		-- aps.af_purchase_all,
    		-- aps.af_start_trial_unique,
    		-- aps.af_start_trial_all,
    		-- aps.trial_starts_unique,
    		sum(aps.trial_starts_all) as tot_trials,
    		-- aps.ltv_subs_unique,
    		sum(aps.ltv_subs_all) as tot_subs,
    		sum(aps.ltv_subs_revenue) as tot_revenue
    	FROM advertisers_ios ads
    	JOIN appsflyer_ios aps
    	ON (ads.date = aps.date) AND (ads.advertiser = aps.advertiser) AND (ads.campaign_type = aps.campaign_type)
    	WHERE ads.date >= "2019-05-06" and ads.date <= "2019-05-12" 
    	GROUP BY ads.advertiser, ads.campaign_type
    ) AS derivedTable;


As you can see, I left a couple columns in there but they are commented out. Those columns could be useful to add to this report if we wanted too. So many options! so little time!

Here's an example output from this query (using SQL Alchemy):
![](https://github.com/EfficiencyJunky/UCB_DataBootcamp_Homework_repo/blob/master/13-Project_Week_2/Resources/actionable_insights.png?raw=true)

So what we can immediately understand from this output is that our Google Ads have a much higher cost (CPI and CPT) than the others, and we can tell that our Facebook Evergreen ads are providing the best CPT, while our Pinterest ads have the lowest CPI. So this means we may want to focus on optimizations for Google and Increase spend on Facebook. We would also consider lowering our bid caps on the Advanced Apple Search ads because those costs are a little high.

Note that we can't get the spend data from Apple Search Ads Basic through the above process, so we'll have to input that manually after running this query in order to get the CPI and CPT for that channel.



## DISCLAIMERS ABOUT ACTUAL DATA USED IN 
Just to be clear, the data provided 
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTMyNzM0NDExNywtMzQzOTg1MTk0LC0xMz
M0NjQ1NzY4LDY2MTUwMjAzMiwtMzk5NTE4NTk3LC0xMDgwOTM4
MTI4XX0=
-->