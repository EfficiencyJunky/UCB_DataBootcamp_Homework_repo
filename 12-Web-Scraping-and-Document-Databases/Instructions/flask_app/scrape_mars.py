#!/usr/bin/env python
# coding: utf-8

# # Setting Up

# In[1]:


# Import BeautifulSoup
from bs4 import BeautifulSoup
from splinter import Browser
import pandas as pd
import datetime as dt
from time import sleep






def mars_news(browser):
      # # Visit the NASA mars NEW SITES
      url = "https://mars.nasa.gov/news/"
      # Visit the mars nasa new site
      browser.visit(url)

      browser.is_element_present_by_css("ul.item_list li.slide", wait_time=0.5)

      html = browser.html
      news_soup = BeautifulSoup(html, "html.parser")

      # print(news_soup)

      # slide element has everything in the 
      # <ul class="item_list">
      #      <li class="slide">
      # </ul>
      try:
            slide_element = news_soup.select_one("ul.item_list li.slide")
            slide_element.find("div", class_="content_title")

            # use the parent element to find the first "a tag" and save it as news_itles
            news_title = slide_element.find("div", class_="content_title").get_text()

            news_paragraph = slide_element.find("div", class_="article_teaser_body").get_text()
      
      except AttributeError:
            return None, None
      

      return news_title, news_paragraph







# # JPL SPACE IMAGES FEATURED IMAGE
def featured_images(browser):
      # visit URL
      url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
      browser.visit(url)

      # sleep(2)
      browser.is_element_present_by_id("full_image", wait_time=0.5)

      # browser.is_element_present_by_css("ul.item_list li.slide", wait_time=0.5)

      # ask splinter to go to the site, hit a button with class name "full_image"
      # <button class="full_image">Full Image</button>
      full_image_button = browser.find_by_id("full_image")
      full_image_button.click()

      # Find the more info button and click that
      browser.is_element_present_by_text("more info", wait_time=1)
      more_info_element = browser.find_link_by_partial_text("more info")
      more_info_element.click()

      # sleep(2)

      # parse the results html with soup
      html = browser.html
      image_soup = BeautifulSoup(html, "html.parser")


      img = image_soup.select_one("figure.lede a img")
      
      try:
            img_url = img.get("src")

      except AttributeError:
            return None


      #use the base url to create an absolute url
      img_url = f"https://www.jpl.nasa.gov{img_url}"
      
      return img_url


# # MARS WEATHER
def twitter_weather(browser):
      
      url = "https://twitter.com/marswxreport?lang=en"
      browser.visit(url)

      html = browser.html
      weather_soup = BeautifulSoup(html, "html.parser")

      # first find a tweet with the data-name "Mars Weather"
      mars_weather_tweet = weather_soup.find("div", 
                                          attrs={"class":"tweet",
                                                "data-name": "Mars Weather"
                                          })
      # print(mars_weather_tweet)

      # Next search within the tweet for p tag containing the tweet text
      mars_weather = mars_weather_tweet.find("p", "tweet-text").get_text()
      
      
      return mars_weather






## HEMISPHERES
def hemispheres(browser):

      url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
      browser.visit(url)

      # sleep(2)
      browser.is_element_present_by_css("a.product-item h3", wait_time=0.5)

      hemisphere_image_urls = []

      #first get a list of all the hemispheres
      links = browser.find_by_css("a.product-item h3")
      # print(links[0].text)

      for item in range(len(links)):
            hemisphere = {}
            
            # browser.is_element_present_by_css("a.product-item h3", wait_time=0.5)

            # We have to find the element on each loop to avoid a stale element exception
            browser.find_by_css("a.product-item h3")[item].click()
            
            # Next we find the Sample Image anchor tag and extract the href
            sample_element = browser.find_link_by_text("Sample").first
            hemisphere["img_url"] = sample_element["href"]
            
            # Get Hemisphere title
            hemisphere["title"] = browser.find_by_css("h2.title").text
            
            #Append hemisphere object to list
            hemisphere_image_urls.append(hemisphere)
            
            #Finally, we navigate backwards
            browser.back()


      return hemisphere_image_urls

# this website was down https://astrogeology.usgs.gov
# So I had to make my own thing for this app to function
def hemisphere_temporary_function():
      
      hemisphere_image_urls = []
      
      hemisphere1 = {
            "title" : "https://astrogeology.usgs.gov is currently down so here's a pretty picture instead",
            "img_url" : "https://www.jpl.nasa.gov/spaceimages/images/mediumsize/PIA14934_ip.jpg"
      }

      hemisphere2 = {
            "title" : "https://astrogeology.usgs.gov is currently down so here's a pretty picture instead",
            "img_url" : "https://www.jpl.nasa.gov/spaceimages/images/mediumsize/PIA16883_ip.jpg"
      }


      hemisphere3 = {
            "title" : "https://astrogeology.usgs.gov is currently down so here's a pretty picture instead",
            "img_url" : "https://www.jpl.nasa.gov/spaceimages/images/mediumsize/PIA18292_ip.jpg"
      }

      hemisphere4 = {
            "title" : "https://astrogeology.usgs.gov is currently down so here's a pretty picture instead",
            "img_url" : "https://www.jpl.nasa.gov/spaceimages/images/mediumsize/PIA19141_ip.jpg"
      }

      hemisphere_image_urls.append(hemisphere1)
      hemisphere_image_urls.append(hemisphere2)
      hemisphere_image_urls.append(hemisphere3)
      hemisphere_image_urls.append(hemisphere4)

      return [hemisphere1, hemisphere2, hemisphere3, hemisphere4]


def scrape_hemisphere(html_text):
      hemisphere_soup = BeautifulSoup(html_text, "html.parser")

      try:
            title_element = hemisphere_soup("h2", class_="title").get_text()
            sample_element = hemisphere_soup("a", text="Sample").get("href")

      except AttributeError:
            title_element = None
            sample_element = None

      hemisphere = {
            "title" : title_element,
            "img_url" : sample_element
      }

      return hemisphere




# # MARS FACTS
def mars_facts():

      try:
            df = pd.read_html("https://space-facts.com/mars/")[0]

            # print(df)


      except BaseException:
            return None

      df.columns=["description", "value"]
      df.set_index("description", inplace=True)

      return df.to_html(classes="table table-striped")



def scrape_all():

      # set the executable path and initialize the chrome browser
      executable_path = {"executable_path" : "/usr/local/bin/chromedriver"}
      browser = Browser("chrome", **executable_path)

      # print(mars_news(browser))
      # print(featured_images(browser))

      news_title, news_paragraph = mars_news(browser)

      featured_img = featured_images(browser) 

      mars_weather = twitter_weather(browser)

      # hemisphere_image_urls = hemispheres(browser)
      hemisphere_image_urls = hemisphere_temporary_function()
      
      facts = mars_facts()

      timestamp = dt.datetime.now()

      data = {
            "news_title" : news_title,
            "news_paragraph" : news_paragraph,
            "featured_image" : featured_img,
            "hemispheres" : hemisphere_image_urls,
            "weather" : mars_weather,
            "facts" : facts,
            "last_modified" : timestamp

      }


      browser.quit()

      return data


if __name__ == "__main__":
      print(scrape_all())






