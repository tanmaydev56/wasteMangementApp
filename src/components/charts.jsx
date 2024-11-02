import { useState, useEffect } from 'react';
import IMG5 from '../assets/images/dots.png';
import { PieChart, Pie, Cell, Legend, Line} from 'recharts';
import { AreaChart, YAxis, Tooltip, Area, BarChart, Bar} from 'recharts'; // Replace with appropriate imports
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


function Charts() {
    const data = [
        { name: 'Group A', value: 700 },
        { name: 'Group B', value: 300 }
      ];
    const COLORS = ['#5351fb', '#00eed1'];

    const DraggableBox = ({ id, index, moveBox, children }) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: ItemTypes.BOX,
            item: { id, index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }));
    
        const [, drop] = useDrop(() => ({
            accept: ItemTypes.BOX,
            hover: (draggedItem) => {
                if (draggedItem.index !== index) {
                    moveBox(draggedItem.index, index);
                    draggedItem.index = index;
                }
            },
        }));
    
        return (
            <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
                {children}
            </div>
        );
    };

    const [boxes, setBoxes] = useState([
        { id: 'box1', content: 'Sales Overview' },
        { id: 'box2', content: 'Yearly Sales' },
        { id: 'box3', content: 'Revenue Updates' },
    ]);

    const ItemTypes = {
        BOX: 'box',
    };    

    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <ul style={{ width: 'fit-content' }} className="flex flex-wrap inline-block flex-col relative left-[67%] bottom-[20px] gap-6">
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center mr-4 inline-block">
                        <svg className="w-4 h-4 mr-2">
                            <circle cx="8" cy="8" r="6" stroke={entry.color} fill="none" strokeWidth="2" />
                        </svg>
                        <span>
                            $23,450 <br />{index === 0 ? 'Profit' : 'Expanse'}
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    const renderLegend1 = (props) => {
        const { payload } = props;
        return (
            <ul style={{ width: 'fit-content' }} className="flex flex-wrap gap-6 mt-16 mx-auto">
                {payload.map((entry, index) => (
                    <li key={`item-${index}`} className="flex items-center mr-4">
                        <svg className="w-4 h-4 mr-2">
                            <circle cx="8" cy="8" r="6" stroke={entry.color} fill="none" strokeWidth="2" />
                        </svg>
                        <span>
                            {index === 0 ? '$5476' : '$4476'} <br /><span style={{color: 'grey'}}>{index === 0 ? '2023' : '2022'}</span>
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    const data3 = [
        { name: 'Page A', pv: 40, uv: 4000 },
        { name: 'Page B', pv: 60, uv: 3000 },
        { name: 'Page C', pv: 30, uv: 2000 },
        { name: 'Page D', pv: 70, uv: 2780 },
        { name: 'Page E', pv: 40, uv: 1890 },
        { name: 'Page F', pv: 50, uv: 2390 },
        { name: 'Page G', pv: 30, uv: 3490 },
    ];

    const data1 = [
        { x: '2023-10-01', y: 1507.2 },
        { x: '2023-10-02', y: 2512 },
        { x: '2023-10-03', y: 2260.8 },
        { x: '2023-10-04', y: 3516.8 },
        { x: '2023-10-06', y: 2739.2 },
        { x: '2023-10-08', y: 5476 },
        { x: '2023-10-10', y: 2804 },
        { x: '2023-10-11', y: 4024 },
        { x: '2023-10-12', y: 2008 },
        { x: '2023-10-13', y: 4024 },
    ];
      
    const data2 = [
        { x: '2023-10-01', y1: 497.3 },
        { x: '2023-10-02', y1: 1492 },
        { x: '2023-10-03', y1: 1243 },
        { x: '2023-10-04', y1: 2486 },
        { x: '2023-10-06', y1: 1740.6 },
        { x: '2023-10-08', y1: 4476 },
        { x: '2023-10-10', y1: 1513.3 },
        { x: '2023-10-11', y1: 3062.6 },
        { x: '2023-10-12', y1: 891.3 },
        { x: '2023-10-13', y1: 2678 },
    ];

    const moveBox = (fromIndex, toIndex) => {
        const updatedBoxes = [...boxes];
        const [movedBox] = updatedBoxes.splice(fromIndex, 1);
        updatedBoxes.splice(toIndex, 0, movedBox);
        setBoxes(updatedBoxes);
    };

    const [chartWidth, setChartWidth] = useState(280);
    const [pieCenter, setPieCenter] = useState(70);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setChartWidth(window.innerWidth * 0.7); // Small screen size                
            } else if (window.innerWidth < 768 && window.innerWidth > 640) {
                setChartWidth(400); // Medium screen size
            } else {
                setChartWidth(280); // Default size
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call handler right away so state gets updated with initial window size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setPieCenter(75); // Small screen size
            } else if (window.innerWidth < 768 && window.innerWidth > 640) {
                setPieCenter(130); // Medium screen size
            }else if (window.innerWidth < 1240 && window.innerWidth > 768) {
                setPieCenter(90); // Medium screen size
            } else {
                setPieCenter(100); // Default size
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call handler right away so state gets updated with initial window size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <div className="flex mx-auto w-[76.9vw] max-md:w-[90vw] flex-wrap max-xl:justify-center relative left-[10%]">
                    {boxes.map((box, index) => (
                        <DraggableBox key={box.id} id={box.id} index={index} moveBox={moveBox}>
                            {box.id === 'box1' && (
                                <div style={{ boxShadow: "4px 4px 16px 0px rgba(0, 0, 0, 0.10), -4px -4px 16px 0px rgba(244, 125, 74, 0.10)" }} className="pie bg-white m-2 px-4 py-8 rounded-[15px]">
                                    <p className='text-[32px] font-medium max-md:text-center'>{box.content}</p>
                                    <PieChart width={chartWidth} height={200} radius={[10,10]}>
                                        <text x={pieCenter+5} y={105} textAnchor="middle" dominantBaseline="middle">
                                            $500,000
                                        </text>
                                        <Pie
                                            data={data}
                                            cx={pieCenter}
                                            cy={100}
                                            innerRadius={55}
                                            outerRadius={75}
                                            fill="#8884d8"
                                            paddingAngle={10}
                                            dataKey="value"
                                            cornerRadius={10}
                                            stroke="#fff"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" align="left" content={renderLegend} />
                                        <Line name="pv of pages" type="monotone" dataKey="pv" stroke="#8884d8" />
                                        <Line name="uv of pages" type="monotone" dataKey="uv" stroke="#82ca9d" />
                                    </PieChart>
                                    <div className="dots bg-[#f4f6fa] w-fit ] relative bottom-[80%] left-[90%] p-2 rounded-full cursor-grab">
                                        <img className='w-[20px]' src={IMG5} alt="" />
                                    </div>
                                </div>
                            )}
                            {box.id === 'box2' && (
                                <div style={{ boxShadow: "4px 4px 16px 0px rgba(0, 0, 0, 0.10), -4px -4px 16px 0px rgba(244, 125, 74, 0.10)" }} className="bar bg-white m-2 px-4 py-6 rounded-[15px]">
                                    <p className='text-[32px] font-medium mb-4 max-md:text-center'>{box.content}</p>
                                    <BarChart width={chartWidth} height={200} data={data3}>
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#5051fa" stopOpacity={0.3} />
                                                <stop offset="50%" stopColor="#5051fa" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#5051fa" stopOpacity={0.3} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <YAxis domain={[0, 'auto']} tickLine={false} axisLine={false} />
                                        <Bar dataKey="pv" fill="#5051fa" barSize={15} radius={[10, 10, 10, 10]} />
                                    </BarChart>
                                    <div className="dots bg-[#f4f6fa] w-fit relative bottom-[87%] left-[90%] p-2 rounded-full cursor-grab">
                                        <img className='w-[20px]' src={IMG5} alt="" />
                                    </div>
                                </div>
                            )}
                            {box.id === 'box3' && (
                                <div style={{ boxShadow: "4px 4px 16px 0px rgba(0, 0, 0, 0.10), -4px -4px 16px 0px rgba(244, 125, 74, 0.10)" }} className="pie bg-white m-2 px-4 py-6 rounded-[15px]">
                                    <p className='text-[32px] font-medium mb-4 max-md:text-center'>{box.content}</p>
                                    <AreaChart width={chartWidth} height={200} data={data1}>
                                        <YAxis domain={[0, 'auto']} hide />
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" align="left" content={renderLegend1} />
                                        <Line name="pv of pages" type="monotone" dataKey="pv" stroke="#8884d8" />
                                        <Line name="uv of pages" type="monotone" dataKey="uv" stroke="#82ca9d" />
                                        <Area
                                            type="monotone"
                                            dataKey="y"
                                            fill="none"
                                            stroke="#5d59f8"
                                            strokeWidth={5} // Increase the stroke thickness
                                        />
                                        <defs>
                                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#b9e6ff" stopOpacity={1} /> {/* Transparent color at the top */}
                                                <stop offset="10%" stopColor="#b9e6ff" stopOpacity={1} /> {/* Slightly opaque color */}
                                                <stop offset="50%" stopColor="#b9e6ff" stopOpacity={1} />
                                                <stop offset="95%" stopColor="#a8dffe" stopOpacity={1} /> {/* Desired fill color */}
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="y1"
                                            data={data2} // Use data for the second area graph
                                            fill="url(#colorPv)" // Use the gradient fill
                                            stroke="#b9e6ff"
                                            strokeWidth={0} // Increase the stroke thickness
                                        />
                                    </AreaChart>
                                    <div className="dots bg-[#f4f6fa] w-fit relative bottom-[87%] left-[90%] p-2 rounded-full cursor-grab">
                                        <img className='w-[20px]' src={IMG5} alt="" />
                                    </div>
                                </div>
                            )}
                        </DraggableBox>
                    ))}
                </div>
            </DndProvider>
        </div>
    );
}

export default Charts;