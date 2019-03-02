# First we'll import the os module
# This will allow us to create file paths across operating systems
import os

# Module for reading CSV files
import csv

csvpath = os.path.join( 'Resources', 'budget_data.csv')

# initialize variables to make things easy to read
numMonths = 0
netProfitLosses = 0
netDeltaOfProfitLosses = 0
greatestIncrease = {    "date" : "0",
                        "amount" : 0
                   }
                   
greatestDecrease = {    "date" : "0",
                        "amount" : 0
                   }

profitLossDelta = 0
previousProfitLoss = 0

# Method 2: Improved Reading using CSV module
with open(csvpath, newline='') as csvfile:

    # CSV reader specifies delimiter and variable that holds contents
    csvreader = csv.reader(csvfile, delimiter=',')

    #print(csvreader)

    # Read the header row first (skip this step if there is no header)
    csv_header = next(csvreader)
    # print(f"CSV Header: {csv_header}")

    # Read each row of data after the header
    for row in csvreader:

        ################################################
        # Row[0] = Date (string)
        # Row[1] = Profit/Losses (integer)
        ################################################

        #The total number of months included in the dataset
        numMonths += 1

        currentProfitLoss = int(row[1])

        #The net total amount of "Profit/Losses" over the entire period
        netProfitLosses += currentProfitLoss
        
        if numMonths != 1:
            # calculate increase/decrease delta
            # subtract previous profit/loss from current profit/loss
            profitLossDelta = currentProfitLoss - previousProfitLoss

            # add it to net delta
            netDeltaOfProfitLosses += profitLossDelta

        #The greatest increase in profits (date and amount) over the entire period
        # determin if it's the greatest increase so far and store in "greatest increase"
        # using the max function so it's slightly easier to read
        if max(greatestIncrease['amount'], profitLossDelta) == profitLossDelta:
            greatestIncrease['amount'] = profitLossDelta
            greatestIncrease['date'] = row[0]

        #The greatest decrease in losses (date and amount) over the entire period
        # determin if it's the greatest decrease so far and store in "greatest decrease"
        # using the min function so it's slightly easier to read
        if min(greatestDecrease['amount'], profitLossDelta) == profitLossDelta:
            greatestDecrease['amount'] = profitLossDelta
            greatestDecrease['date'] = row[0]

        # store the current profit/loss for the next time around the loop
        previousProfitLoss = int(row[1])


#The average of the changes in "Profit/Losses" over the entire period

# Financial Analysis
# ----------------------------
# Total Months: 86
# Total: $38382578
# Average  Change: $-2315.12
# Greatest Increase in Profits: Feb-2012 ($1926159)
# Greatest Decrease in Profits: Sep-2013 ($-2196167)

# print("Financial Analysis")
# print("----------------------------")
# print("Total Months: " + str(numMonths))
# print("Net Profits/Losses: $" + str(netProfitLosses))
# print("Average Change: $" + str(round( netDeltaOfProfitLosses/(numMonths-1) , 2 ) ) )
# print("Greatest Increase in Profits: " + greatestIncrease["date"]  +  "  ($"  + str(greatestIncrease["amount"]) +  ")" )
# print("Greatest Decrease in Profits: " + greatestDecrease["date"]  +  "  ($"  + str(greatestDecrease["amount"]) +  ")" )

# create file to write summary to
f= open("output.txt","w+")

# write out the information
f.write("Financial Analysis" + "\n")
f.write("----------------------------" + "\n")
f.write("Total Months: " + str(numMonths) + "\n")
f.write("Net Profits/Losses: $" + str(netProfitLosses) + "\n")
f.write("Average Change: $" + str(round( netDeltaOfProfitLosses/(numMonths-1) , 2 ) )  + "\n")
f.write("Greatest Increase in Profits: " + greatestIncrease["date"]  +  "  ($"  + str(greatestIncrease["amount"]) +  ")"  + "\n")
f.write("Greatest Decrease in Profits: " + greatestDecrease["date"]  +  "  ($"  + str(greatestDecrease["amount"]) +  ")"  + "\n")

# close the file    
f.close() 

# open the file in 'read' mode
f=open("output.txt", "r")

# print the contents to terminal
if f.mode == 'r':
    contents =f.read()
    print(contents)