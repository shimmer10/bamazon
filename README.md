# bamazon

## **This page includes two node/sql database management applications**

## **Bamazon Customer**

### **This program starts by prompting the user for a choice**
     * The options are all available items
        * This is a select query to create the list of all items
     * It them asks them how many they would like to purchase
     * The inventory is then checked to be sure that there are enough of the item to purchase
     * If there are enough items the purchase goes through
        * An update query is completed to change the quantity of the item left
        * A message appears telling them how much they spent
     * If there are not enough a message is displayed to inform them of this

## **Bamazon Manager**

### **This program starts by promting the user for a choice**
     * Those choices are "View Products For Sale", "View Low Inventory Items", "Add to Inventory", "Add New Product", "Exit";
     * They user keeps chosing options until they select "Exit"
### **If the user chooses 'View Products for Sale' they will see all products in inventory**
     * A select query is done to display all of the in the inventory
### **If the user chooses 'View Low Inventory Items' they will see all items with an low stock of five or under**
     * The same select query is reused but the items with only five or less are built and displayed.
### **If the user chooses 'Add to Inventory' they will be prompted to enter more information**
     * All items are displayed for them to chose from
     * They are then prompted to enter the quantity to add to stock
     * An update query is done to update the stock_quantity of the item they selected with the updated stock total
### **If the user chooses 'Add New Product' they will be prompted to enter more information**
     * The user will be asked for the following information
        * Product Name
        * Department Name
        * Price
        * Stock (intial stock quantity)
    * An insert is then done to add the new item and it's information to the database
### **If the user chooses 'Exit'**
     * This is the only way the user can exit the program and the connection to the database is closed

## **Validation**
     * All fields that require user input are validation
     * Validation includes checking to be sure that user input is not blank
     * Inputs expecting number include the blank check as well as the Not a Number (NaN) check
## **Security**
     * To avoid delivering passwords the code is reading a file that does not get delivered to derive the password