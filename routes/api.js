'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      //check for undefined
      if(req.body.text === undefined || req.body.locale === undefined){
        return res.json({ error: 'Required field(s) missing' })
      }
      //get and check the text
      let text = req.body.text
      if(text === ''){
        return res.json({ error: 'No text to translate' })
      }
      //get and check the locale (mode)
      let mode = req.body.locale
      if(mode !== 'american-to-british' && mode !== 'british-to-american'){
        return res.json({ error: 'Invalid value for locale field' })
      }
      console.log(text, mode)
      let translation = translator.translate(text, mode)
      console.log(translation)
      res.json(translation)
    });
};
