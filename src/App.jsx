import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { Group, ColorSwatch, } from '@mantine/core'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

const App = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [result, setResult] = useState('');
    const [color, setColor] = useState('#ffffff')
    const [responseLoading, setResponseLoading] = useState(false);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');

            // Set the canvas width and height to match its CSS dimensions
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            // Set default line properties
            ctx.lineWidth = 2; // Adjust this to make lines thicker or thinner
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
        }
    }, []);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Calculate cursor position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left; // Adjust for canvas position
        const y = e.clientY - rect.top;  // Adjust for canvas position
    
        ctx.beginPath();
        ctx.moveTo(x, y); // Start drawing from the adjusted position
        setIsDrawing(true);
    };
    
    const draw = (e) => {
        if (!isDrawing) return;
    
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left; // Adjust for canvas position
        const y = e.clientY - rect.top;  // Adjust for canvas position
    
        ctx.strokeStyle = color || 'white';
        ctx.lineTo(x, y); // Draw to the adjusted position
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setResult('')
    };

    const solveCanvas = async () => {
        setResponseLoading(true);
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/png');

        try {
            const response = await axios.post('https://genaicalculator-backend-1.onrender.com/api/calculate', { image: dataURL });
            setResult(response.data.result);
            setResponseLoading(false);
        } catch (error) {
            console.error('Error processing image:', error);
        }
    };

    return (
        <MantineProvider>
            <div className='bg-neutral-700 h-fit'>
          <div className='grid grid-cols-3 gap-2 bg-neutral-800 p-6'>
           <button
            className='bg-teal-500 hover:bg-teal-700 text-black font-bold py-2 px-4 rounded'
            onClick={solveCanvas}>
            Solve
           </button>
           <Group>
            <ColorSwatch color="#000000" onClick={() => setColor('#000000')} />
            <ColorSwatch color="#ffffff" onClick={() => setColor('#ffffff')} />
            <ColorSwatch color="#ee3333" onClick={() => setColor('#ee3333')} />
            <ColorSwatch color="#e64980"  onClick={() => setColor('#e64980')} />
            <ColorSwatch color="#be4bdb"  onClick={() => setColor('#be4bdb')} />
            <ColorSwatch color="#893200"  onClick={() => setColor('#893200')}/>
            <ColorSwatch color="#228be6"  onClick={() => setColor('#228be6')}/>
            <ColorSwatch color="#3333ee"  onClick={() => setColor('#3333ee')}/>
            <ColorSwatch color="#40c057"  onClick={() => setColor('#40c057')}/>
            <ColorSwatch color="#00aa00"  onClick={() => setColor('#00aa00')}/>
            <ColorSwatch color="#fab005"  onClick={() => setColor('#fab005')}/>
            <ColorSwatch color="#fd7e14"  onClick={() => setColor('#fd7e14')}/>
            </Group>
            <button
            className='bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded'
            onClick={resetCanvas}
            >
                Reset
            </button>
          </div>
          <div className='w-screen h-screen p-4 sm:flex justify-evenly'>
            <div className='sm:w-[60%] w-[100%] h-[80%]'>
                <canvas
                    className='w-full bg-black rounded-xl h-[100%]'
                    ref={canvasRef}
                    style={{ border: '1px solid black' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                ></canvas>
            </div>
            <div className='sm:w-[35%] w-[100%] sm:h-[80%] h-[15%] overflow-y-scroll no-scrollbar p-2 bg-neutral-900 rounded-xl'>
                <div className='text-neutral-100 text-2xl font-bold text-center'>Result</div>
                <p className='text-neutral-100 text-lg font-bold'>{responseLoading ? 'Loading please wait' : result}</p>
            </div>
          </div>
          </div>
          </MantineProvider>
    );
};

export default App;
