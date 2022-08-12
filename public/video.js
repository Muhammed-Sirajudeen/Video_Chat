let streams;
let remotestream;
let peerconnection;
let remotevideo=document.querySelector("#remotevideo")
let localstream;

var socket = io("https://localhost:3000");
async function init(){





navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(async (stream)=>{
	localstream = document.querySelector("#videoElement");
	streams=stream;

	localstream.srcObject=streams;
	


})
}



let createoffer=async()=>{
	peerconnection= new RTCPeerConnection({
	iceServers: [
	{urls:["stun:stun1.l.google.com:19302","stun:stun2.l.google.com:19302"],},
	]
	
	});
	remotestream=new MediaStream();
	var remotevideo=document.querySelector("#remotevideo")







	//have to add events here
	streams.getTracks().forEach((track)=>{
		peerconnection.addTrack(track)
	})

	peerconnection.ontrack=async (event) =>{
		remotestream.addTrack(event.track,remotestream);
		remotevideo.srcObject=remotestream;

			
				// remotestream.addTrack(event.track)
			

			// remotevideo.srcObject=event.streams[0];

			
			// remotevideo.srcObject= track;

		

	};



	peerconnection.onicecandidate=async (event) =>{
		if(event.candidate){
			console.log(event.candidate)

				
						

		}
	}



	peerconnection.createOffer().then(async (offer)=>{
		peerconnection.setLocalDescription(offer)

		setTimeout(async ()=>{

			console.log("hey")
		socket.emit("first_transaction",JSON.stringify(peerconnection.localDescription))

	},5000)
	






})

}

// socket.on("ice_candidate",(msg)=>{
// 	peerconnection.addIceCandidate(JSON.parse(msg))
// })





socket.on("second_transaction",async (msg)=>{

	remotestream= new MediaStream();
	var recv_msg=JSON.parse(msg)
	//adding features
	peerconnection= new RTCPeerConnection({
	iceServers: [
	{urls:["stun:stun1.l.google.com:19302","stun:stun2.l.google.com:19302"],},
	]
	})
	var remotevideo=document.querySelector("#remotevideo")




	//have to add events here
	streams.getTracks().forEach((track)=>{
		peerconnection.addTrack(track)
	})

	peerconnection.ontrack=async (event) =>{
			remotestream.addTrack(event.track,remotestream);
				remotevideo.srcObject=remotestream;



			

			
				// remotevideo.srcObject= track;

		

	}


	peerconnection.onicecandidate=async (event) =>{
		if(event.candidate){
			
			

		}
	}
	
	
	offer = JSON.parse(msg)
	peerconnection.setRemoteDescription(offer);


	

	await peerconnection.createAnswer().then(async (answer)=>{
		peerconnection.setLocalDescription(answer)


		setTimeout(()=>{
		socket.emit("third_transaction",JSON.stringify(peerconnection.localDescription))

		},5000)


	})














})

socket.on("fourth_transaction",(msg)=>{
	let recieved_msg=JSON.parse(msg);
	if(!peerconnection.currentRemoteDescription){
		peerconnection.setRemoteDescription(recieved_msg);
	}



	// console.log("here")
	// console.log(peerconnection)
})







init();

