/**
 * @author Anirban Bhattcharya
 * 
 * @create 03-12-2019
 * @modify 
 * @desc The file to serve the subscription
 */

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 9000
app.get('/' , (req,res) => res.send('Hello World!'))

// const dummyDb = { subscription:null }
let dummyDb = {}



app.post('/save-subscription', async (req,res) =>{
	try
	{
		const subscription = req.body
		dummyDb = subscription
		res.json({message: 'success' })
	}
	catch(err)
	{
		console.log("New Error 1",err)
	}
})
///To save the subscription from the user


const vapidKeys = {
	publicKey: 'BOZYYYkXJZYbFkP7KQzQCZJrRoFV3v6-gBzFhqHrttI2z_DSftrAuJeAM1Ow2noVdBNVoHjLghrQPB3vjQFq4oo',
	privateKey: '8CzjuNzbQifv6F4r5nxwVmMHME6JqF0_BUm9S-rrqvE'
}
///To send the push notifications

webpush.setVapidDetails(
	'mailto:rick.bhattacharya@gmail.com',
	vapidKeys.publicKey,
	vapidKeys.privateKey
)
//route to test send notification
app.get('/send-notification',(req, res) => {
	try
	{
		const subscription = dummyDb 
		const payload = JSON.stringify({
			message: "First time New code",
			tag:new Date()
		  });
		  try
		  {
			  webpush.sendNotification(subscription, payload).catch(err => console.log(err));
			  console.log("Sent finally")
		  }
		  catch(err)
		  {
			  console.log("New Error 2",err)
		  }
		res.json(payload)
	}
	catch(err)
	{
		console.log("New Error 3",err)
	}
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))