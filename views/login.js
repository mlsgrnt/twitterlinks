var html = require('choo/html')

module.exports = view

function view (state, emit) {
  var TITLE = 'Linkr'
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (state.oauth.user) return html`<body><script>window.location='/'</script></body>`

  return html`
    <body class="bg-blue white vh-100 dt w-100" >
            <div class="pa5-ns pa2">
              <h1 class="f-headline  measure-narrow ma0 pa0">Linkr</h1>
              <p style="line-height:0.5" class="f1-ns f4 lh-copy measure  pa0 ma0 mb4 ">
                <span>Twitter; just the links</span>
              </p>
              <p class="f2-ns f3 lh-copy pv5-ns pv2 measure-narrow">
                Your Twitter timeline is filled with vile hate, racism, and inscrutible irony.
                <div class="bt o-40 w5"></div>
                Filter it down to the essentials.
                <div class="bt o-40 w5"></div>
                Filter out everything except the links.
              </p>
            </div>
            <div class="fr mh3 ma1 f1-ns f3">
              <a onclick=${handleClick} class=" link b blue bg-white hover-bg-washed-blue bg-animate pa3 br3" href="">Log in with Twitter</a>
            </div>

            <div class="cursor-normal code white tj o-10 absolute f2 top-0 left-0 backgroundText">
https://t.co/9wD3HLA0wohttps://t.co/DiQkLKgnEZhttps://t.co/5vSjEySo4zhttps://t.co/A1eWu9dCV2https://t.co/dZvszcw8m4https://t.co/ER4tk7l9lEhttps://t.co/65rS4Nt3DMhttps://t.co/aulXfSnAvshttps://t.co/W0qozw1jmOhttps://t.co/ncz308lUBOhttps://t.co/olVPRvOLrdhttps://t.co/qNl604ZYUShttps://t.co/NIDfvxYPA9https://t.co/ab6DN6BFdnhttps://t.co/UyTEYcLfVBhttps://t.co/gEjJKVq1Iyhttps://t.co/BMWAyLNIwEhttps://t.co/6ihNx01f6Lhttps://t.co/U75kBBvfR0https://t.co/G4ph31kue7https://t.co/zilGSg1jrshttps://t.co/nCTxmtGd4Uhttps://t.co/p828EFAI7Ohttps://t.co/Gbg76E4LNKhttps://t.co/YM3HbVPBhXhttps://t.co/InpUXxszukhttps://t.co/wYvyh7ipf1https://t.co/232zEO6qbJhttps://t.co/FwKmTIXFalhttps://t.co/tqQk5IHzuMhttps://t.co/9dBAh2FmJ5https://t.co/oLgBHbVMJahttps://t.co/bwhujxxKgthttps://t.co/DXPdjNrIS3https://t.co/NV0NUnYeNrhttps://t.co/ZRizQH21LBhttps://t.co/5AGHto3MEJhttps://t.co/bWlUhE1Ifdhttps://t.co/HcK0u5DH0Ehttps://t.co/PcHJrdLtC9https://t.co/fOWdASzs2mhttps://t.co/YqQw6b6T5Rhttps://t.co/t5dNXjRgwxhttps://t.co/a2jPy9pkcQhttps://t.co/Cfr6ijAu2Rhttps://t.co/pE8bdW6Rm0https://t.co/3qg91ngd3thttps://t.co/CdlSulSwiChttps://t.co/Zdt8v8zbMvhttps://t.co/hWi3OZZNkVhttps://t.co/tJyUf2YhwMhttps://t.co/QOaoG8LsCihttps://t.co/vcz23Xn1WThttps://t.co/6ppZ3MdfwUhttps://t.co/SqQ9o4qVmvhttps://t.co/eGoBPBmhdJhttps://t.co/cfAsg7vq13https://t.co/OwLIyaIBU9https://t.co/hrtKhZTYHBhttps://t.co/0xMIoJ6OL3https://t.co/27LspKMRtshttps://t.co/cRehIPAShShttps://t.co/DCMX3sF4RHhttps://t.co/jhv2ulbzpQhttps://t.co/GbYHduVI5fhttps://t.co/WUTZXxLWSphttps://t.co/Olm9L1PEryhttps://t.co/5w7sk0d36Dhttps://t.co/HMgVUrODqkhttps://t.co/0ngVocYMyQhttps://t.co/ZykeYXKQD4https://t.co/OG3VdRCNkShttps://t.co/WbwEOLkXOFhttps://t.co/mZArb8cIROhttps://t.co/bh3M6jqnN8https://t.co/Cu9LKuZS9xhttps://t.co/XYpU7dBLcShttps://t.co/bmVKtL5ferhttps://t.co/OqJ9PpbvM6https://t.co/XLq7k8AWcdhttps://t.co/sHPmcWrwl4https://t.co/IWTqVllzZ7https://t.co/CimahpcHmahttps://t.co/f8rhhX7gVphttps://t.co/KzukB7e1yPhttps://t.co/cVeU60KnrUhttps://t.co/xsXzCZ0ut9https://t.co/ql71CID1YUhttps://t.co/kW6aVcozAXhttps://t.co/9Usq309jPbhttps://t.co/c4uPyRRz6nhttps://t.co/FvxypQg3wchttps://t.co/UUh75Mp6U4https://t.co/XSZURPANHlhttps://t.co/LN6yfemI7bhttps://t.co/CUZEEwVhzThttps://t.co/OWRUXPRuurhttps://t.co/sZUfEEzOPRhttps://t.co/wRiJC7m4S5https://t.co/Vw0yK5OBOahttps://t.co/OAiImiasGChttps://t.co/npVaVK3lbfhttps://t.co/Fl5uQdkj9ihttps://t.co/kEEe1QIMLOhttps://t.co/FOKdj2KbFYhttps://t.co/ocdxh5Y53thttps://t.co/WsDnDuZgeGhttps://t.co/82C4jvQTTehttps://t.co/A48qqUgJJZhttps://t.co/k6BoOgJHTxhttps://t.co/Cpa0TMl0AFhttps://t.co/2XMV1oaGPchttps://t.co/xQIbuQwUolhttps://t.co/kJue8mwC7thttps://t.co/VCmcohx0Qjhttps://t.co/5Dc6Hwhevlhttps://t.co/jfFkuiQgVThttps://t.co/JuIyzsYVLAhttps://t.co/pYrYP83tqihttps://t.co/N6agwDRIbmhttps://t.co/ZeiEV2YaHJhttps://t.co/wi6NrNTXVThttps://t.co/72MxQ2ibOShttps://t.co/gxwvQtyrCQhttps://t.co/K90ZY2z0PFhttps://t.co/c960ZFbZIchttps://t.co/ZuxLDtRxxMhttps://t.co/JPzKETsE4zhttps://t.co/Ckhz6FCJpLhttps://t.co/ZuxLDtRxxMhttps://t.co/7uT1eLqVgdhttps://t.co/Cv1mDIdEP5https://t.co/Sq4NSfF8g5
  </div>
   </body>
  `

  function handleClick () {
    emit('oauth:requestToken')
  }
}
