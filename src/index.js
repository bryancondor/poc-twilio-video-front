'use strict'
const { connect, createLocalTracks } = require('twilio-video');
const { getAccessToken } = require('./get-access-token');

const accessToken = getAccessToken();

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
                    const track = publication.track;
                    document.getElementById('remote-media-div').appendChild(track.attach());
                }
            });

            participant.on('trackSubscribed', track => {
                document.getElementById('remote-media-div').appendChild(track.attach());
            });
        });

        // For RemoteParticipants that are already in the Room, we can attach their RemoteTracks by iterating over the Room's participants:
        room.participants.forEach(participant => {
            participant.tracks.forEach(publication => {
                if (publication.track) {
                    document.getElementById('remote-media-div').appendChild(publication.track.attach());
                }
            });

            participant.on('trackSubscribed', track => {
                document.getElementById('remote-media-div').appendChild(track.attach());
            });
        });


        const toggleAudio = document.getElementById('toggle-audio');
        const toggleVideo = document.getElementById('toggle-video');

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
                }
            });
        })

    });

