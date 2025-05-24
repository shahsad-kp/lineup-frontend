import * as React from 'react';
import {Step, StepButton, stepClasses, StepIndicator, stepIndicatorClasses, Stepper} from "@mui/joy";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Typography from '@mui/joy/Typography';
import {useMemo} from "react";
import { Check } from '@mui/icons-material';


type Props = {
    totalSteps: number,
    currentStep: number,
};

export const SetupTracker = (props: Props) => {
    const {totalSteps, currentStep} = props;

    return (
        <Stepper sx={{ width: '100%' }}>
            {(Array.from({length: totalSteps})).map((_, index) => (
                <Step
                    key={index}
                    indicator={
                        <StepIndicator
                            variant={currentStep <= index ? 'soft' : 'solid'}
                            color={currentStep < index ? 'neutral' : 'primary'}
                        >
                            {currentStep < index ? index + 1: (
                                currentStep === index ? (
                                        <KeyboardArrowDownRoundedIcon
                                            sx={{
                                                color: 'primary.solidBg',
                                                fontSize: '1.25rem',
                                            }}
                                        />

                                ) : (
                                    <Check
                                        sx={{
                                            color: 'primary.solidBg',
                                            fontSize: '1.25rem',
                                        }}
                                    />
                                )
                            )}
                        </StepIndicator>
                    }
                    sx={[
                        currentStep > index &&
                        index !== 2 && { '&::after': { bgcolor: 'primary.solidBg' } },
                    ]}
                >
                </Step>
            ))}
        </Stepper>
    );
};