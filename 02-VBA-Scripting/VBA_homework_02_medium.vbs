
' Create a script that will loop through all the stocks and take the following info.

  ' Yearly change from what the stock opened the year at to what the closing price was.

  ' The percent change from the what it opened the year at to what it closed.
        ' percent change formula:
            ' y1 = open price
            ' y2 = close price
            ' ((y2 - y1) / y1)*100

  ' The total Volume of the stock

  ' Ticker symbol

' You should also have conditional formatting that will highlight positive change in green and negative change in red.


Sub VBA_Homework_medium()
    
    ' --------------------------------------------
    ' DEFINE GLOBAL VARIABLES
    ' --------------------------------------------

    ' Create variables to store a human readable version of the columns we care about
    Dim tickerColumn As Integer
    Dim dateColumn As Integer
    Dim openColumn As Integer
    Dim closeColumn As Integer
    Dim volumeColumn As Integer
    
    tickerColumn = 1
    dateColumn = 2
    openColumn = 3
    closeColumn = 6
    volumeColumn = 7
    
    Dim columForTickerTotals_TickerName As Integer
    Dim columForTickerTotals_YearlyChange As Integer
    Dim columForTickerTotals_PercentChange As Integer
    Dim columForTickerTotals_Volume As Integer
    
    columForTickerTotals_TickerName = 9
    columForTickerTotals_YearlyChange = 10
    columForTickerTotals_PercentChange = 11
    columForTickerTotals_Volume = 12
    
    ' Define variable to store a human readable version of the row we will be putting the aggregate ticker volumes in
    ' This will increment as we find each ticker name and sum the values
    Dim rowToDisplayTickerTotals As Integer
    
    ' Define variable to store open price
    Dim openPrice As Double
    
    ' Define variable to store close price
    Dim closePrice As Double
    
    Dim yearlyChange As Double
    Dim percentChange As Double
    
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
        
        ' Display the WorksheetName as we process the information to let you know something's happening
        WorksheetName = ws.Name
        MsgBox "Ready to Process Worksheet: " & WorksheetName & vbNewLine & "Click OK to proceed. this may take a while...." & vbNewLine & "consider getting up and stretching." & vbNewLine & "or go outside and pet a dog."

        ' calculate the last non-blank cell in column A(1)
        lRow = ws.Cells(Rows.Count, 1).End(xlUp).Row

        ' Create column headers for the information we will display
        ws.Cells(1, columForTickerTotals_TickerName).Value = "Ticker"
        ws.Cells(1, columForTickerTotals_YearlyChange).Value = "Yearly Change"
        ws.Cells(1, columForTickerTotals_PercentChange).Value = "Percent Change"
        ws.Cells(1, columForTickerTotals_Volume).Value = "Total Stock Volume"
        
        ' sets the first ticker in each sheet to appear on row 2
        rowToDisplayTickerTotals = 2
    
        ' store the first open price for the first ticker
        openPrice = ws.Cells(2, openColumn).Value
    
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
            
                ' store the final close price for the year
                closePrice = ws.Cells(i, closeColumn).Value
            
                ' if the open price on January 1st was 0 (looking at you PLNT!!!!)
                ' then look backward from the row where we are now (which is the last row for this ticker)
                ' and find the actual open price for the first day the stock was available
                If openPrice = 0 And closePrice <> 0 Then
                    
                    ' create a new index called j
                    Dim j As Long
                    
                    ' set this index to equal i, which is the row for the current tickers last day in the year
                    j = i - 1
                    
                    ' search the "open price" column in reverse order for the first instance of "0"
                    Do While ws.Cells(j, openColumn).Value <> 0
                        j = j - 1
                    Loop
                    
                    ' set the open price to the price that is in the row AFTER the first instance of 0 (this is the first price the stock was listed at)
                    openPrice = ws.Cells(j + 1, openColumn).Value

                End If
            
                ' calculate the yearly change
                yearlyChange = closePrice - openPrice
            
                 ' put the yearly Change next to its ticker name
                ws.Cells(rowToDisplayTickerTotals, columForTickerTotals_YearlyChange).Value = yearlyChange

                ' set color of Yearly Change Cell based on if it's positive or negative -- 4 is Green and 3 is Red
                If yearlyChange >= 0 Then
                    ws.Cells(rowToDisplayTickerTotals, columForTickerTotals_YearlyChange).Interior.ColorIndex = 4
                Else
                    ws.Cells(rowToDisplayTickerTotals, columForTickerTotals_YearlyChange).Interior.ColorIndex = 3
                End If
                
                ' calculate the percent Change using ((y2 - y1) / y1)*100 formula
                ' if the yearly change was 0, just set the percent change to 0 to avoid dividing by 0
                If yearlyChange = 0 Then
                    percentChange = 0
                Else
                    percentChange = ((yearlyChange / openPrice) * 100)
                End If
                
                 ' put the percent Change next to its ticker name
                ws.Cells(rowToDisplayTickerTotals, columForTickerTotals_PercentChange).Value = percentChange & "%"
            
                ' put the total volume next to its ticker name
                ws.Cells(rowToDisplayTickerTotals, columForTickerTotals_Volume).Value = totalVolumeOfCurrentTicker
            
                ' Increment the row we will insert the next ticker name and volume
                rowToDisplayTickerTotals = rowToDisplayTickerTotals + 1
            
                ' store the open price for next ticker
                openPrice = ws.Cells(i + 1, openColumn).Value
            
                ' reset this to 0 so we can use for the next ticker
                totalVolumeOfCurrentTicker = 0
            
            End If
        
        Next i
        
    Next ws
    
End Sub




