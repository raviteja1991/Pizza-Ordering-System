import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-pizza-order',
  templateUrl: './pizza-order.component.html',
  styleUrls: ['./pizza-order.component.scss']
})
export class PizzaOrderComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }
  
  sizeOfPizza: any = {
    small: {
      price: 5
    }, medium: {
      price: 7
    }, large: {
      price: 8
    }, extraLarge: {
      price: 9
    },
  }

  pizzaToppings: any = {
    vegToppings: [{
      topping: 'Tomatoes',
      price: 1
    }, {
      topping: 'Onions',
      price: 0.5
    }, {
      topping: 'Bell Pepper',
      price: 1
    }, {
      topping: 'Mushrooms',
      price: 1.2
    }, {
      topping: 'Pineapple',
      price: 0.75
    }],
    nonVegToppings: [{
      topping: 'Sausage',
      price: 1
    }, {
      topping: 'Pepperoni',
      price: 2
    }, {
      topping: 'Barbecue Chicken',
      price: 3
    }]
  }

  promoOfferOne!: string | null;
  promoOfferTwo!: string | null;
  promoOfferThree!: string | null;

  smallDiscount!: number;
  mediumDiscount!: number;
  largeDiscount!: number;

  order: any = {
    small: [],
    medium: [],
    large: [],
    extraLarge: []
  };

  pizzaQuantity: any = { small: 0, medium: 0, large: 0, extraLarge: 0 };

  addToCart(e: { currentTarget: any; }) {
    let target = e.currentTarget;
    let parent = $(target).parents('.btns');
    let size = target.getAttribute('data-field');
    let type = target.getAttribute('data-type');
    var input = parent.find("input[name='" + size + "']");
    var currentVal: number = Number(input.val());
    if (!isNaN(currentVal)) {
      if (type == 'add') {
        if (currentVal < Number(input.attr('max'))) {
          currentVal++;
          input.val(currentVal).change();
          this.pizzaOrderPlaced(size, currentVal, type)
        }
      }
      else if (type == 'remove') {
        if (currentVal > Number(input.attr('min'))) {
          currentVal--;
          input.val(currentVal).change();
          this.pizzaOrderPlaced(size, currentVal, type)
        }
      }
      this.findOutPromotions();
    } else {
      input.val(0);
    }
  }

  pizzaOrderPlaced(size: string, currentVal: number, type: string) {
    if (type == 'add') {
      var orderSize = JSON.parse(JSON.stringify(this.order[size]));
      if (orderSize.length > 0) {
        this.order[size].push(orderSize[0]);
      } else {
        this.order[size].push({
          price: this.sizeOfPizza[size].price,
          pizzaToppings: []
        });
      }
      this.pizzaQuantity[size] = currentVal;
    } else {
      this.order[size].splice(0, 1);
      if (this.order[size].length == 0) {
        let checkVals = document.getElementsByClassName(size + '-checkbox');
        Array.prototype.forEach.call(checkVals, function (cv, i) {
          cv.checked = false;
        });
      }
      this.pizzaQuantity[size] = currentVal;
    }
  }

  selectPizzaToppings(e: { currentTarget: any; }, obj: { topping: any; }) {
    let target = e.currentTarget, id = target.getAttribute('id'), value = target.value, checked = target.checked, size = target.getAttribute('data-size');
    let chkdTopping = { id: id, name: obj.topping, price: value, checked: checked, size: size }

    if (chkdTopping.checked) {
      this.order[size].forEach((val: any, i: string | number) => {
        this.order[size][i].pizzaToppings.push(chkdTopping)
      })
    } else {
      let index: any;
      let checkItem = this.order[size][0]["pizzaToppings"].find((element: { id: any; }, j: any) => {
        if (element.id === chkdTopping.id) {
          index = j;
          return element;
        } else {
          return undefined;
        }
      });
      this.order[size].forEach((val: any, k: string | number) => {
        this.order[size][k].pizzaToppings.splice(index, 1)
      })
    }
    this.findOutPromotions();
  }

  findOutPromotions() {
    if (this.order.medium.length == 1) {
      this.order.medium.forEach((promo1: { pizzaToppings: any; }) => {
        if ('pizzaToppings' in promo1) {
          let topings = promo1.pizzaToppings;
          if (topings.length == 2) {
            this.promoOfferOne = "Offer One - Applied";
          } else { this.promoOfferOne = null; }
        }
      })
    } else { this.promoOfferOne = null; }

    if (this.order.medium.length == 2) {
      this.order.medium.forEach((promo2: { pizzaToppings: any; }) => {
        if ('pizzaToppings' in promo2) {
          let topings = promo2.pizzaToppings;
          if (topings.length == 4) {
            this.promoOfferTwo = "Offer Two - Applied";
          } else { this.promoOfferTwo = null; }
        }
      })
    } else { this.promoOfferTwo = null; }

    if (this.order.large.length == 1) {
      let pepporoni = false, bbq = false;
      this.order.large.forEach((promo3: { pizzaToppings: any; }) => {
        if ('pizzaToppings' in promo3) {
          let topings = promo3.pizzaToppings;
          topings.forEach((toping: { name: string; }) => {
            if (toping.name.toLowerCase() === 'pepperoni') pepporoni = true;
            if (toping.name.toLowerCase() === 'barbecue chicken') bbq = true;
          })
          if (topings.length == 4 || (pepporoni && bbq)) {
            this.promoOfferThree = "Offer three - Applied";
          } else { this.promoOfferThree = null; }
        }
      })
    } else { this.promoOfferThree = null; }
  }

  totalPriceAfterPromo(orderList: any, size: any, pizzaQuantity: any) {
    let Total = 0, price: any, quantity = 0;

    if (orderList.length > 0) {
      switch (size) {
        case 'small':
          Total = Total + this.sizeOfPizza.small.price;
          break;
        case 'medium':
          Total = Total + this.sizeOfPizza.medium.price;
          break;
        case 'large':
          Total = Total + this.sizeOfPizza.large.price;
          break;
        case 'extraLarge':
          Total = Total + this.sizeOfPizza.extraLarge.price;
          break;
        default:
          Total = Total + 0;
      }

      orderList.forEach((element: { [x: string]: string; pizzaToppings: any; }, i: any) => {
        quantity++;
        if ('price' in element) {
          price = parseFloat(element['price']);
        }
        let topings = 'pizzaToppings' in element ? element.pizzaToppings : [];
        let pepperoni: any, peporoniPrice: any, bbq: any, bbqPrice: any, pepBBQPromo: any;
        if (topings.length > 0) {
          topings.forEach((topping: { name: string; price: string; }) => {
            if (size == 'large') {
              if (topping.name.toLowerCase() === 'pepperoni') {
                peporoniPrice = parseFloat(topping.price);
                pepperoni = true;
              }
              if (topping.name.toLowerCase() === 'barbecue chicken') {
                bbqPrice = parseFloat(topping.price);
                bbq = true;
              }
              Total = Total + parseFloat(topping.price);
            } else {
              Total = Total + parseFloat(topping.price);
            }
          });
          if (size == 'large') {
            pepBBQPromo = peporoniPrice + bbqPrice;
            if (pepperoni && bbq) {
              this.largeDiscount = (Total - (pepBBQPromo)) + (pepBBQPromo / 2);
            } else if (topings.length == 4) {
              this.largeDiscount = (Total / 2);
            }
          }
        }
      });
      Total = Total + (price * (quantity - 1));
    }

    if (orderList.length > 0 && Total > 0) {
      if (size == 'medium') {
        if (this.promoOfferOne) {
          this.smallDiscount = this.sizeOfPizza.small.price;
          return `<b>Price: $${Total}</b> <br> <b>After Discount: $${this.smallDiscount.toFixed(2)} </b>`;
        }
        else if (this.promoOfferTwo) {
          this.mediumDiscount = Number((9 * quantity).toFixed(2));
          return `<b>Price: $${Total}</b> <br> <b>After Discount: $${this.mediumDiscount} </b>`;
        } else {
          return `<b> ${Total == 0 ? "" : '$' + Total.toFixed(2)} </b>`;
        }
      }
      else if (size == 'large' && this.promoOfferThree) {
        return `<b>Price: $${Total}</b> <br> <b>After Discount: $${this.largeDiscount} </b>`;
      }
      else {
        return `<b> ${Total == 0 ? "" : '$' + Total.toFixed(2)} </b>`;
      }
    }
    else {
      return `<b> ${Total == 0 ? "" : '$' + Total.toFixed(2)} </b>`;
    }
  }
}