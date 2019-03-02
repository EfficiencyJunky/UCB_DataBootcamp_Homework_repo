' Create a script that will loop through each year of stock data and grab the total amount of volume each stock had over the year.

' You will also need to display the ticker symbol to coincide with the total volume.

' Your result should look as follows (note: all solution images are for 2015 data).

Sub VBA_Homework_easy()
    
    ' --------------------------------------------
    ' DEFINE GLOBAL VARIABLES
    ' --------------------------------------------

    ' Create variables to store a human readable version of the columns we care about
    Dim tickerColumn As Integer
    Dim volumeColumn As Integer
    Dim columForTickerTotals_TickerName As Integer
    Dim columForTickerTotals_Volume As Integer
    
    tickerColumn = 1
    volumeColumn = 7
    columForTickerTotals_TickerName = 9
    columForTickerTotals_Volume = 10
    
    ' Define variable to store a human readable version of the row we will be putting the aggregate ticker volumes in
    ' This will increment as we find each ticker name and sum the values
    Dim rowToDisplayTickerTotals As Integer
    
    ' Define a variable to store the sum of each ticker volume
    Dim totalVolume As Long
    totalVolumeOfCurrentTicker = 0

    ' Define variable to store the last non-blank cell in column A
    Dim lRow As Long
 
    ' Created a Variable to Hold the sheet name
    Dim WorksheetName As String

    ' --------------------------------------------
    ' LOOP THROUGH ALL SHEETS
    ' --------------------------------------------
    For Each ws In Worksheets
        
        ' Display the WorksheetName as we process the information just for fun
        WorksheetName = ws.Name
        MsgBox "Ready to Process Worksheet: " & WorksheetName & vbNewLine & "Click OK to proceed. this may take a while...." & vbNewLine & "consider getting up and stretching." & vbNewLine & "or go outside and pet a dog."

        ' calculate the last non-blank cell in column A(1)
         lRow = ws.Cells(Rows.Count, 1).End(xlUp).Row

        ' Create column headers for the information we will display
        ws.Cells(1, columForTickerTotals_TickerName).Value = "Ticker"
        ws.Cells(1, columForTickerTotals_Volume).Value = "Total Stock Volume"
        
        ' sets the first ticker in each sheet to appear on row 2
        rowToDisplayTickerTotals = 2
    
        ' --------------------------------------------
        ' LOOP THROUGH ALL ROWS IN THE SHEET
        ' --------------------------------------------
        For i = 2 To lRow
    
            ' add current row's ticker volume to the total
            totalVolumeOfCurrentTicker = totalVolumeOfCurrentTicker + ws.Cells(i, volumeColumn).Value
    
            ' Searches for when the ticker name of the next row is different than that of the current row
            If ws.Cells(i, tickerColumn).Value <> ws.Cells(i + 1, tickerColumn).Value Then
    
                ' MsgBox "Ticker: " & Cells(i, tickerColumn).Value & vbNewLine & "Volume: " & totalVolumeOfCurrentTicker
             
                ' put the current ticker name in the row/column next to where we will display the total volume
                ws.Cells(rowToDisplayTickerTotals, columForTickerTotals_TickerName).Value = ws.Cells(i, tickerColumn).Value
            
                ' put the total volume next to its ticker name
                ws.Cells(rowToDisplayTickerTotals, columForTickerTotals_Volume).Value = totalVolumeOfCurrentTicker
            
                ' Increment the row we will insert the next ticker name and volume
                rowToDisplayTickerTotals = rowToDisplayTickerTotals + 1
            
                ' reset this to 0 so we can use for the next ticker
                totalVolumeOfCurrentTicker = 0
            
            End If
        
        Next i
        
    Next ws
    
End Sub
