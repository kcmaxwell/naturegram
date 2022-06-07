import '../App.css';

export default function Popup({innerRef, ...props}) {
    return (
        <div className='popup-container'>
            <div className='popup' ref={innerRef}>
                {props.children}
            </div>
        </div>
    );
}