'use strict'
const { connect, createLocalTracks, createLocalVideoTrack } = require('twilio-video');
const { getAccessToken } = require('./get-access-token');
require('./style.css');

const accessToken = getAccessToken();

createLocalVideoTrack().then(track => {
    const localMediaContainer = document.getElementById('local-media');
    localMediaContainer.appendChild(track.attach());
});

createLocalTracks(
    {
        audio: true,
        video: { width: 640 }
    }
)
    .then(localTracks => {
        return connect(accessToken, {
            // name: 'my-room-name',
            tracks: localTracks
        });
    })
    .then(room => {
        console.log(`Connected to Room: ${room.name}`);
        const groupRemoteMediaElement = document.getElementById('group-remote-media');

        // ### Working with Remote Participants ##
        // # Handle Connected Partipants #

        // Log your Client's LocalParticipant in the Room
        const localParticipant = room.localParticipant;
        console.log(`Connected to the Room as LocalParticipant "${localParticipant.identity}"`);

        // Log any Participants already connected to the Room
        room.participants.forEach(participant => {
            console.log(`Participant "${participant.identity}" is connected to the Room`);
        });

        // Log new Participants as they connect to the Room
        room.once('participantConnected', participant => {
            console.log(`Participant "${participant.identity}" has connected to the Room`);
        });

        // Log Participants as they disconnect from the Room
        room.once('participantDisconnected', participant => {
            console.log(`Participant "${participant.identity}" has disconnected from the Room`);
        });



        // # Handle Participant Connection Events #
        room.on('participantConnected', participant => {
            console.log(`Participant connected: ${participant.identity}`);
        });

        room.on('participantDisconnected', participant => {
            console.log(`Participant disconnected: ${participant.identity}`);
        });



        // # Display a Remote Participant's Video #
        // Attach the Participant's Media to a <div> element.
        room.on('participantConnected', participant => {
            console.log(`Participant "${participant.identity}" connected`);

            participant.tracks.forEach(publication => {
                if (publication.isSubscribed) {
                    console.log('[bcd] NEW CONEXION - PUBLICATION WAS SUSCRIBED', publication);
                    const track = publication.track;
                    groupRemoteMediaElement.appendChild(track.attach());
                }
            });

            participant.on('trackSubscribed', track => {
                console.log('[bcd] NEW CONEXION - TRACK SUSCRIBED', track);

                const videoElement = track.attach();
                videoElement.setAttribute('id', participant.identity);

                if (checkExist(groupRemoteMediaElement, participant)) {
                    groupRemoteMediaElement.replaceChildren(videoElement);
                } else {
                    groupRemoteMediaElement.appendChild(videoElement);
                }

            });

        });

        // For RemoteParticipants that are already in the Room, we can attach their RemoteTracks by iterating over the Room's participants:
        room.participants.forEach(participant => {
            participant.tracks.forEach(publication => {
                if (publication.track) {
                    console.log('[bcd] ALREADY CONNECTED - CURRENT TRACKS IN PUBLICATION', publication);
                    groupRemoteMediaElement.appendChild(publication.track.attach());
                }
            });

            participant.on('trackSubscribed', track => {
                console.log('[bcd] ALREADY CONNECTED - TRACK SUSCRIBED', track);
                const videoElement = track.attach();

                videoElement.setAttribute('id', participant.identity);
                groupRemoteMediaElement.appendChild(videoElement);
            });
        });


        const toggleAudio = document.getElementById('toggle-audio');
        const toggleVideo = document.getElementById('toggle-video');


        // Mute Your Local Media
        toggleAudio.addEventListener('click', (event) => {
            room.localParticipant.audioTracks.forEach(publication => {
                if (event.target.checked) {
                    publication.track.enable();
                } else {
                    publication.track.disable();
                }

            });
        });

        toggleVideo.addEventListener('click', (event) => {
            room.localParticipant.videoTracks.forEach(publication => {
                if (event.target.checked) {
                    publication.track.enable();
                } else {
                    publication.track.disable();
                    // publication.unpublish(); // turn off camera's ligth
                }
            });
        })

    });

function checkExist(groupRemoteMediaElement, participant) {
    const listVideoElements = [...groupRemoteMediaElement.children];

    const wasRegistered = listVideoElements.some(element => {
        return element.getAttribute('id') === participant.identity;
    });

    console.log('[bcd] wasRegistered:', wasRegistered);

    return wasRegistered;
}

