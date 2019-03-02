# First we'll import the os module
# This will allow us to create file paths across operating systems
import os

# Module for reading CSV files
import csv

csvpath = os.path.join( 'Resources', 'election_data.csv')

# initialize variables to make things easy to read
numVotesTotal = 0

# create an empty list to store our candidates names and vote tally in
candidatesList = []

# example of what each item in the list will look like just for fun
candidateDictionaryStructure =  { 
                                    "name" : "FirstName",
                                    "votes" : 0
                                }


# Method 2: Improved Reading using CSV module
with open(csvpath, newline='') as csvfile:

    # CSV reader specifies delimiter and variable that holds contents
    csvreader = csv.reader(csvfile, delimiter=',')

    #print(csvreader)
    print("processing...")

    # Read the header row first (skip this step if there is now header)
    csv_header = next(csvreader)
    #print(f"CSV Header: {csv_header}")

    # Read in the first vote row
    firstRow = next(csvreader)

    numVotesTotal = 1

    # Append this cadidate's name and single vote to candidatesList
    candidatesList.append({ "name" : firstRow[2], "votes" : 1 })

    # Read each row of data after the header
    for row in csvreader:
        ################################################
        # Row[0] = Voter ID (string)
        # Row[1] = County (string)
        # Row[2] = Candidate (string)
        ################################################

        # analyze the votes and calculate each of the following:

        # The total number of votes cast
        numVotesTotal += 1

        # A complete list of candidates who received votes
        
        # find out if candidate's name is already in list
        # If it is, add a vote to candidate's tally
        currentCandidatesName = row[2]
        candidateInList = False

        for candidate in candidatesList:
            if candidate['name'] == currentCandidatesName:
                candidateInList = True
                candidate['votes'] += 1
                break

        # if candidate is is not in the list, add the candidate to the list with 1 vote
        if candidateInList == False:
            candidatesList.append({ "name" : currentCandidatesName, "votes" : 1 })
        


# The percentage of votes each candidate won
# The total number of votes each candidate won
# The winner of the election based on popular vote.

# Election Results
# -------------------------
# Total Votes: 3521001
# -------------------------
# Khan: 63.000% (2218231)
# Correy: 20.000% (704200)
# Li: 14.000% (492940)
# O'Tooley: 3.000% (105630)
# -------------------------
# Winner: Khan
# -------------------------
winner = ""
previousHighestPercent = 0

# print("Election Results")
# print("-------------------------")
# print("Total Votes: " + str(numVotesTotal))
# print("-------------------------")
# for candidate in candidatesList:
#     percentOfTotal = round( (candidate['votes'] / numVotesTotal) * 100, 3 )
#     print(candidate['name'] + ": " + str(percentOfTotal) + "% (" + str(candidate['votes']) + ")")
#     if previousPercent < percentOfTotal:
#         winner = candidate['name']
#         previousPercent = percentOfTotal
# print("-------------------------")
# print("Winner: " + winner)
# print("-------------------------")

# create file to write summary to
f= open("output.txt","w+")

# write out the information
f.write("Election Results" + "\n")
f.write("-------------------------" + "\n")
f.write("Total Votes: " + str(numVotesTotal) + "\n")
f.write("-------------------------" + "\n")
for candidate in candidatesList:
    percentOfTotal = round( (candidate['votes'] / numVotesTotal) * 100, 3 )
    f.write(candidate['name'] + ": " + str(percentOfTotal) + "% (" + str(candidate['votes']) + ")" + "\n")
    if percentOfTotal > previousHighestPercent:
        winner = candidate['name']
        previousHighestPercent = percentOfTotal
f.write("-------------------------" + "\n")
f.write("Winner: " + winner + "\n")
f.write("-------------------------" + "\n")

# close the file    
f.close() 

# open the file in 'read' mode
f=open("output.txt", "r")

# print the contents to terminal
if f.mode == 'r':
    contents =f.read()
    print(contents)