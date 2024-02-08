import React from "react";
import { SemiCircleProgress } from "react-semicircle-progressbar";

export default function ProgressBar({percentage, color, text}) {
    return (
        <SemiCircleProgress 
                    percentage={percentage}
                    size={{
                      width: 200,
                      height: 200,
                    }}
                    strokeWidth={10}
                    strokeColor={color}
                    hasBackground={true}
                    percentageSeperator={text}
        />
    );
}