import '../App.css';

export default function Popup({innerRef, ...props}) {
    return (
        <div className='popup-background'>
            <div className='popup-container' ref={innerRef}>
                <div className='popup-contents'>
                {props.children}
                </div>
            </div>
        </div>
    );
}