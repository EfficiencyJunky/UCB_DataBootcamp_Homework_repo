USE acquisition_bi_db;

-- Query to check successful load
SELECT * FROM advertisers_ios;

SELECT * FROM advertisers_android;

SELECT * FROM appsflyer_ios;

SELECT * FROM appsflyer_android;

-- Check to see if the date selection works
SELECT * FROM appsflyer_ios
WHERE date > '2019-01-21';

-- Join the tables with advertiser and appsflyer data for each OS (iOS and ANDROID) 
-- on date, advertiser, and campaign_type
-- this gives us a composite table with all the information we need to start building charts
SELECT ads.*, 
	aps.installs, 
    aps.sessions, 
    aps.new_workout_saved_unique, 
    -- aps.af_purchase_unique,
    -- aps.af_purchase_all,
    -- aps.af_start_trial_unique,
    -- aps.af_start_trial_all,
    -- aps.trial_starts_unique,
    aps.trial_starts_all,
    -- aps.ltv_subs_unique,
    aps.ltv_subs_all,
    aps.ltv_subs_revenue
FROM advertisers_ios ads
JOIN appsflyer_ios aps
ON (ads.date = aps.date) AND (ads.advertiser = aps.advertiser) AND (ads.campaign_type = aps.campaign_type);


SELECT ads.*, 
	aps.installs, 
    aps.sessions, 
    aps.new_workout_saved_unique, 
    -- aps.af_purchase_unique,
    -- aps.af_purchase_all,
    -- aps.af_start_trial_unique,
    -- aps.af_start_trial_all,
    -- aps.trial_starts_unique,
    aps.trial_starts_all,
    -- aps.ltv_subs_unique,
    aps.ltv_subs_all,
    aps.ltv_subs_revenue
FROM advertisers_android ads
JOIN appsflyer_android aps
ON (ads.date = aps.date) AND (ads.advertiser = aps.advertiser) AND (ads.campaign_type = aps.campaign_type);



-- create a performance summary for each ad network of Spend, Installs, and Trial Starts for a specific date range
-- include calculated columns for the CPI and CPT
SELECT advertiser, tot_spend, tot_installs, tot_spend/tot_installs as CPI, tot_trials, tot_spend/tot_trials as CPT
FROM
(
	SELECT ads.advertiser as advertiser, sum(ads.spend) as tot_spend, sum(ads.impressions) as tot_impressions, sum(ads.clicks) as tot_clicks, 
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
	GROUP BY ads.advertiser
) AS derivedTable;
    
    
-- create a performance summary for each ad network and split by campaign_type
-- of Spend, Installs, and Trial Starts for a specific date range
-- include calculated columns for the CPI and CPT
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