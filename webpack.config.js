const path = require('path');

  const oConfig = {
    //
    //Penser aussi à ajouter dans package.json,
    //   Qqch comme : "myBuild": "webpack --progress --profile --watch"
    //   dans la rubrique "scripts" (lançable donc par : npm run myBuild).
    //
    
    entry: [
        "./_src/index.ts" //Inclura tout seul tous les sources dont il dépendra, et etc... récursivement donc.
    ]
    , output: {
        path: path.resolve(__dirname, "_dist")        
        , filename: "index.js"
    }    

    , mode: "development"  //Si on commente cette ligne ce sera "production" par défaut => bundle de sortie serait illisible/minifié sur une ligne.

  //  , devtool: 'inline-source-map'  //Doit également être mis dans le tsconfig.json ("sourceMap":true)
   
   //--------------------------------------

    , module: {
      
      //Pour gestion des fichiers .ts :
      // BESOIN de : (npm install --save-dev ts-loader typescript) + (nécessité d'un tsconfig.json même vide mais vaut mieux y préciser la "target" !)
      rules: [
        {
          test: /\.ts$/  //Extension des fichiers à traiter (ne pas mettre entre guillemets !)
          , use: "ts-loader"
        }
      ]
    }
    ,resolve: {
      extensions: [ ".ts", ".js" ] // ".js" juste rajouté pour pouvoir traiter aussi en entrée des .js.
    }

    //--------------------------------------

  };

  module.exports = oConfig;