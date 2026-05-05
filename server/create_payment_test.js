(async () => {
  try {
    const resp = await fetch('http://localhost:4242/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 5000 })
    })
    const txt = await resp.text()
    console.log('Status:', resp.status)
    console.log(txt)
  } catch (err) {
    console.error(err)
  }
})()
