const express =  require('express');
const path  =  require('path');
const mongoose = require('mongoose');
const {exec} = require('child_process');
const childCommand = require('child-command');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))


app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
  res.render('homepage.ejs');
  // exec(`adb devices`)
})



app.get('/connecteddevices',(req,res)=>{
    res.render('connecteddevices.ejs');
})


//connected devices 
app.post('/connecteddevices',(req,res)=>{
    // res.send('post request successful!') 
    exec(`adb devices`,(error,stdout,stderr)=>{
      //error handling
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Error occurred');
      }
      if (stderr) {
        console.error(`ADB Error: ${stderr}`);
        return res.status(500).send('ADB Error occurred');
      }
    
      //showing the devices
      const devices = stdout.split('\n').slice(1).filter(line => line.trim() !== '').map(line => {
        const [device, state] = line.trim().split('\t');
        return { device, state };
      });

      res.send(devices);
    }) 
});


app.get('/pairdevice',(req,res)=>{
  res.render('pairdevice.ejs');
})

app.post('/pairdevice',(req,res)=>{
  
    const {ipaddress,pairingport,password,port} = req.body;
    //res.send(`Entered ip: ${ipaddress} Entered key: ${password}`);
    exec(`adb pair ${ipaddress}:${pairingport} ${password}`,(error, stdout,stderr)=>{
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Error occurred during pairing');
      }
      if (stderr) {
        console.error(`ADB Error: ${stderr}`);
        return res.status(500).send('ADB Error occurred during pairing');
      }
      console.log(`Pairing successful: ${stdout}`);
      console.log(ipaddress)
      res.send(`Pairing successful <a href='/connectDevice'>connect Device</a>`);
    })
    

app.get('/connectDevice',(req,res)=>{
    res.render('connectDevice');
})    
app.post('/connectDevice',(req,res)=>{
   
  exec(`adb connect ${ipaddress}:${port}`,(error, stdout,stderr)=>{
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Error occurred during pairing');
      }
      if (stderr) {
        console.error(`ADB Error: ${stderr}`);
        return res.status(500).send('ADB Error occurred during pairing');
      }
      console.log(`Connection successful: ${stdout}`);
      res.send(`Pairing & Connection successful <a href='/'>home</a>`);
    })
})



    // .then(res.redirect('/'))
    // .then(res.send('paired successfully!'))
    // .catch(err=>{console.log(err)})
});



app.listen(3000,()=>{
    console.log('listening on port 3000');
})


