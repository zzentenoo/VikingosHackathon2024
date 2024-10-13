// Button.js
function LogButton({ onClick, children, color, type = "button"  }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-44 h-20 text-black font-semibold rounded-lg hover:bg-red-600 transition duration-200 text-center ${color}`}
        >
            <div>
            {children}
            </div>
        </button>
    );
}

export default LogButton;