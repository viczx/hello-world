/*
    Budget project intro

    After we plan our project, to have a more contructive coding form we use modules, the modules are independent and private from the other instances.
    We create a module using the IIFE statment:

      var 'name of the module' = (function() {
          '... some code'
      }) ();

*/


// budget controller
var budgetController = (function() {

  // expenses
  var Expense = function(id, description, value) {
          this.id = id;
          this.description = description;
          this.value = value;
          this.percentage = -1;
  };

  // we are adding this method to the function constructor to calculate every expense with the total income
  Expense.prototype.calcPercentage = function(totalIncome) {
      if (totalIncome > 0) {
          this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
          this.percentage = -1;
      }
  };

  // nos we have to get the percentage
  Expense.prototype.getPercentage = function() {
      return this.percentage;
  };

  // income
  var Income = function(id, description, value) {
          this.id = id;
          this.description = description;
          this.value = value;
  };

  // calculate the input data
  var calculateTotals = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(cur) {
          sum += cur.value;
      });
      data.totals[type] = sum;
  };

  // data
  var data = {
      allItems: {
          exp: [],
          inc: [],
      },
      totals: {
          exp: 0,
          inc: 0,
      },
      budget: 0,
      percentage: -1,
  };

  // add items to the budget
  return {
      addItem: function(type, des, val) {
          var newItem, ID;

          // new id
            // we need to be the last ID number and not the last array number
            // data.allItems[type][data.allItems[type].lenght - 1]   we have to repeat the data.allItems[type] because we need the position of the right array
          if (data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
          } else {
            ID = 0;
          }

          // new item
          if (type === 'exp') {
              newItem = new Expense(ID, des, val);
          } else if(type === 'inc') {
              newItem = new Income(ID, des, val);
          }

          // push the new item
          data.allItems[type].push(newItem);
          return newItem;
      },

      // delete items from the budget
      deleteItem: function(type, id) {
          var index, ids;

          ids = data.allItems[type].map(function(current) {   // map is similar than forEach, it accepts current, index and array, nut this one return arrays
              return current.id;
          });

          index = ids.indexOf(id);  //  indexOf help us to find the position of an item in the array
          if (index !== -1) {
              data.allItems[type].splice(index, 1);   // splice is a function to delete items in the array, it needs the position and how many items to delete
          };
      },

      // function to calculate the budget
      calculateBudget: function() {
        // 1. calculate the data total
            calculateTotals('exp');
            calculateTotals('inc');
        // 2. calculate the inc - exp
            data.budget = data.totals.inc - data.totals.exp;
        // 3. calculate the percentage
            if (data.totals.inc > 0 ) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
              data.percentage = -1;
            }
      },

      // function to calculate the percentages
      calculatePercentage: function() {
          data.allItems.exp.forEach(function(cur) {
              cur.calcPercentage(data.totals.inc);
          });
      },

      // return the percentage
      getPercentage: function() {
          var allPerc = data.allItems.exp.map(function(cur) {
              return cur.getPercentage();
          });
          return allPerc;
      },

      // return the budget
      getBudget: function() {
          return {
              budget: data.budget,
              incomeTotal: data.totals.inc,
              expenseTotal: data.totals.exp,
              percentage: data.percentage,
          };
      },

      // function for test and see the data
      testing: function() {
        console.log(data);
      }
  };


}) ();


// UI controller
var uicontroller = (function() {

    var DOMstrings = {   //  we use this to simplifly any changes in the html classes
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
    };

    return {
        // store the data
        getInput: function() {
            return {
              type: document.querySelector(DOMstrings.inputType).value,  // it may be inc or exp
              description: document.querySelector(DOMstrings.inputDescription).value,
              value: parseFloat(document.querySelector(DOMstrings.inputValue).value),  // parseFloat converts strings into numbers with decimals
            };
        },

        // create the list data
        addList: function(obj, type) {
          var html, newHtml, element;

            // create the html string
              // here we have to change the placeholder from the html with the data names inside of %...%
            if (type === 'inc') {
              element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            } else if (type === 'exp') {
              element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
            };

            // replace the html string with the data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the data into de DOMs
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);   // insertAdjacentHtml is the function to add html to the DOM

        },

        // delete the list data
        deleteList: function(selectorId) {
            var el = document.getElementById(selectorId);  // we create a var with the document selector
            el.parentNode.removeChild(el);  // to remove from the DOM we need to find and select the parent and then remove the child
        },

        // clear the fields for the data to come
        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);  // querySelectorAll get the data but in list mode
            fieldsArr = Array.prototype.slice.call(fields);  // slice method in Array converts any list into arrays

            // forEach method
            fieldsArr.forEach(function(current, index, array) {     // forEach is a method loop like "for" -> forEach(function(current, index, array) {})
                current.value = "";
            });

            // focus method
            fieldsArr[0].focus();  // focus help us to move the cursor wherever we want
        },

        // change the ui data information
        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.incomeTotal;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.expenseTotal;
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
              document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        getDOMstrings: function() {  // we use this to make the DOMstrings public for the other functions
                return DOMstrings;
        },
    };

}) ();


// global controller
var controller = (function(budgetctrl, uiCtrl) {

      // event listeners
      var setupEventListeners = function () {

        // recovering the DOMstrings
        var DOM = uiCtrl.getDOMstrings();

        // DOMs
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {  // we use this when we want to accept the 'enter' to work ass the click listener
            if (event.keyCode === 13 || event.witch === 13) {  // keyCode is the code of the keyboard button, and swith is the same but for older browsers
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
      };

      // updating the budget
      var updateBudget = function() {
        // 1. Calculate the budget
        budgetctrl.calculateBudget();
        // 2. Return the budget
        var budget = budgetctrl.getBudget();
        // 3. Display budget in UI
        uiCtrl.displayBudget(budget);
      };

      // updating the percentages
      var updatePercentage = function() {
          // 1. Calculate de %
          budgetctrl.calculatePercentage();
          // 2. Get the %
          var percentage = budgetctrl.getPercentage();
          // 3. Display de %
          console.log(percentage);
      };

      // adding data
      var ctrlAddItem = function() {
          var input, newItem;

              // 1. Get the data
              input = uiCtrl.getInput();

              // 2. Add the item to de budget controller
              if (input.description !== "" && !isNaN(input.value) && input.value > 0) {   // isNaN is a function to help us to know if there is a numbre or not
                newItem = budgetctrl.addItem(input.type, input.description, input.value);

                // 3. Add the item to the UI and clear the data from the input
                uiCtrl.addList(newItem, input.type);
                uiCtrl.clearFields();

                // 4. update budget and percentage
                updateBudget();
                updatePercentage();
              };
      };

      // deleting data
      var ctrlDeleteItem = function(event) {
          var itemID, splitID, type, id;

          // identified the item we will delete
          itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;  // parentNode tells who is the parent of the html tree

          if (itemID) {
              splitID = itemID.split('-');  // the split function helps us to split a string and set it in an array
              type = splitID[0];
              id = parseInt(splitID[1]);  // parseInt converts strings into numbers WITHOUT decimals
          };

          // 1. delete the item
          budgetctrl.deleteItem(type, id);

          // 2. delete the item from the ui
          uiCtrl.deleteList(itemID);

          // 3. update the budget and percentage
          updateBudget();
          updatePercentage();

      };

      return {
          init: function() {   // init is used to launch the functions at the loading of the page
              console.log('started!!');
              uiCtrl.displayBudget({
                budget: 0,
                incomeTotal: 0,
                expenseTotal: 0,
                percentage: -1,
              });
              setupEventListeners();
          }
  };

}) (budgetController, uicontroller);  // this is how a module access another module and interact

controller.init();
