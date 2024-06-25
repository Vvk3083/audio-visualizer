// document.getElementById("audio").addEventListener("change", (event) => {
//   const file = event.target.files[0]

//   const reader = new FileReader()

//   reader.addEventListener("load", (event) => {
//     const arrayBuffer = event.target.result

//     const audioContext = new (window.AudioContext ||
//       window.webkitAudioContext)()

//     audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
//       visualize(audioBuffer, audioContext)
//     })
//   })

//   reader.readAsArrayBuffer(file)
// })

// function visualize(audioBuffer, audioContext) {
//   const canvas = document.getElementById("canvas")
//   canvas.width = canvas.clientWidth
//   canvas.height = canvas.clientHeight

//   const analyser = audioContext.createAnalyser()
//   analyser.fftSize = 256

//   const frequencyBufferLength = analyser.frequencyBinCount
//   const frequencyData = new Uint8Array(frequencyBufferLength)

//   const source = audioContext.createBufferSource()
//   source.buffer = audioBuffer
//   source.connect(analyser)
//   analyser.connect(audioContext.destination)
//   source.start()

//   const canvasContext = canvas.getContext("2d")

//   const barWidth = canvas.width / frequencyBufferLength

//   function draw() {
//     requestAnimationFrame(draw)
//     canvasContext.fillStyle = "rgb(173, 216, 230)"
//     canvasContext.fillRect(0, 0, canvas.width, canvas.height)

//     analyser.getByteFrequencyData(frequencyData)

//     for (let i = 0; i < frequencyBufferLength; i++) {
//       // The frequency data is composed of integers on a scale from 0 to 255
//       canvasContext.fillStyle = "rgb(" + (frequencyData[i]) + ",118, 138)";
//       canvasContext.fillRect(
//         i * barWidth,
//         canvas.height - frequencyData[i],
//         barWidth - 1,
//         frequencyData[i]
//       )
//     }
//   }

//   draw()
// }

let audioContext;
let audioBuffer;
let source;
const replayButton = document.getElementById("replay");

document.getElementById("audio").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", (event) => {
        const arrayBuffer = event.target.result;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            audioBuffer = buffer;
            playAudio();
        });
    });

    reader.readAsArrayBuffer(file);

    if (source) {
        source.stop();
        source.disconnect();
    }

    if (replayButton) {
        replayButton.style.display = "none";
    }
});

replayButton.addEventListener("click", () => {
    if (audioBuffer) {
        replayButton.style.display = "none"; // Hide the replay button when clicked
        playAudio();
    }
});

function playAudio() {
    if (source) {
        source.stop();
        source.disconnect();
        // Disconnect the source to stop playback
    }

    if (replayButton) {
        replayButton.style.display = "none";
    }

    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.onended = () => {
        console.log("Audio playback finished.");
        showReplayButton();
    };

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    visualize(analyser);
    source.start();
}

function visualize(analyser) {
    const canvas = document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const frequencyBufferLength = analyser.frequencyBinCount;
    const frequencyData = new Uint8Array(frequencyBufferLength);

    const canvasContext = canvas.getContext("2d");
    const barWidth = (canvas.width) / frequencyBufferLength; 

    function draw() {
        requestAnimationFrame(draw);
        canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas without filling it

        analyser.getByteFrequencyData(frequencyData);

        for (let i = 0; i < frequencyBufferLength; i++) {
            const barHeight = frequencyData[i] * 2;
            canvasContext.fillStyle = "rgb(" + (frequencyData[i]) + ",118, 138)";

            // Left side
            canvasContext.fillRect(
                (canvas.width / 2) - ((i + 1) * barWidth),
                canvas.height - barHeight,
                barWidth - 1,
                barHeight
            );

            // Right side
            canvasContext.fillRect(
                (canvas.width / 2) + (i * barWidth),
                canvas.height - barHeight,
                barWidth - 1,
                barHeight
            );
        }
    }

    draw();
}

function showReplayButton() {
    replayButton.style.display = "block"; // Show the replay button
}

