import * as React from 'react';

type Props = {
    totalSteps: number,
    currentStep: number,
};

export const SetupTracker = (props: Props) => {
    const {totalSteps, currentStep} = props;

    return (
        <div className={'w-full h-1 flex flex-row gap-2 mt-4'}>
            {Array.from({length: totalSteps}).map((_, index) => (
                <hr
                    key={index}
                    className={`w-7 h-full rounded-2xl border-0 ${currentStep > index ? 'bg-brand-accent' : 'bg-text-muted'}`}
                />
            ))}
        </div>
    );
};