-- Drops the acquisition_bi_db if it exists currently --
DROP DATABASE IF EXISTS acquisition_bi_db;

-- Creates the "acquisition_bi_db" database --
CREATE DATABASE acquisition_bi_db;

-- Makes it so all of the following code will affect acquisition_bi_db --
USE acquisition_bi_db;

-- Creates the table "advertisers_ios" within acquisition_bi_db --
CREATE TABLE advertisers_ios (
  date DATE NOT NULL,
  device_type TEXT NOT NULL,
  advertiser TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  spend FLOAT,
  impressions INT,
  impressions_unique INT,
  clicks INT,
  clicks_unique INT,
  views INT
);

CREATE TABLE advertisers_android (
  date DATE NOT NULL,
  device_type TEXT NOT NULL,
  advertiser TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  spend FLOAT,
  impressions INT,
  impressions_unique INT,
  clicks INT,
  clicks_unique INT,
  views INT
);


CREATE TABLE appsflyer_ios (
  date DATE NOT NULL,
  advertiser TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  installs INT,
  sessions INT,
  new_workout_saved_unique INT,
  af_purchase_unique INT,
  af_purchase_all INT,
  af_start_trial_unique INT,
  af_start_trial_all INT,
  trial_starts_unique INT,
  trial_starts_all INT,
  ltv_subs_unique INT,
  ltv_subs_all INT,
  ltv_subs_revenue FLOAT
);

CREATE TABLE appsflyer_android (
  date DATE NOT NULL,
  advertiser TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  installs INT,
  sessions INT,
  new_workout_saved_unique INT,
  af_purchase_unique INT,
  af_purchase_all INT,
  af_start_trial_unique INT,
  af_start_trial_all INT,
  trial_starts_unique INT,
  trial_starts_all INT,
  ltv_subs_unique INT,
  ltv_subs_all INT,
  ltv_subs_revenue FLOAT
);



