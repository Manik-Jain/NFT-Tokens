const {
    getEventInstance : getEventInstance,
    getContractInstance:getContractInstance,
    getWeb3Instance:getWeb3Instance
} = require('./deployable.js');



const listenEvents = async() => {
    const nftContract = await getContractInstance();

    nftContract.events.allEvents((error, event) => {
        if (error) {
          console.error(error);
          return false;
        }
        console.log(event)
      })
    
}


{
    listenEvents(); 
}