import "./css/index.css"
import IMask from "imask"

  //document.querySelector = Faça busca pelo seletor
  const ccbgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path')
  const ccbgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path')
  const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img')

  function setCardType(type) {
    const Colors = {
      visa: ["#436D99", "#2D57F2"],
      mastercard: ["#DF6F29", "#C69347"],
      default: ["black", "gray" ],
    }

    ccbgColor01.setAttribute('fill', Colors[type][0]),
    ccbgColor02.setAttribute('fill', Colors[type][1]),
    ccLogo.setAttribute('src', `cc-${type}.svg`)
  }

  globalThis.setCardType = setCardType

  const securityCode = document.getElementById("security-code") 
  const securityCodePattern = {
    mask: "0000"
  }
  const securityCodeMasked = IMask(securityCode, securityCodePattern)

  const expirationDate = document.getElementById('expiration-date')
  const expirationDatePattern = {
    mask: 'MM{/}YY',
    blocks: {
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,  
      },

      YY: {
        mask: IMask.MaskedRange,
        from: String(new Date().getFullYear()).slice(2),
        to: String(new Date().getFullYear() + 10).slice(2),
      },
    },
  }
  const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

  const cardNumber = document.getElementById("card-number")
  const cardNumberPattern = {
    mask:[
      {
        mask: '0000 0000 0000 0000',
        regex:/^4\d{0,15}/,
        cardtype: 'visa',
      },
      {
        mask: '0000 0000 0000 0000',
        regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
        cardtype: 'mastercard',
      },
      {
        mask: '0000 0000 0000 0000',
        cardtype: 'default',
      },
    ],

    dispatch: function (appended, dynamicMasked) {
      const number = (dynamicMasked.value + appended).replace(/\D/g, '')
      const foundMask = dynamicMasked.compiledMasks.find(function(item) {
        return number.match(item.regex)
      })

      console.log(foundMask)

      return foundMask
    },
  }

  const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

  const addButton = document.getElementById('add-card')
  addButton.addEventListener('click', () => {
    alert('Cartão Adicionado')
  }) 

  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
  })

  const cardHolder = document.querySelector('#card-holder')
    cardHolder.addEventListener('input', () => {
    const ccHolder = document.querySelector('.cc-holder .value')
    
    ccHolder.innerText = cardHolder.value.length === 0 ? 'NOME DO CARTÃO' : cardHolder.value
  }),

  securityCodeMasked.on('accept', () => {
    updateSecurityCode(securityCodeMasked.value);
  })

  function updateSecurityCode(code){
    const ccSecurity = document.querySelector('.cc-security .value')

    ccSecurity.innerText = code.length === 0 ? "..." : code
  }

  cardNumberMasked.on ('accept', () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
  })

  function updateCardNumber(number) {
    const ccNumber = document.querySelector('.cc-number')

    ccNumber.innerText = number.length === 0 ? '... ... ... ...' : number
  }

  expirationDateMasked.on('accept', () => {
    updateExpirationDate(expirationDateMasked.value)
  })

  function updateExpirationDate(date) {
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "00/00" : date
  }

