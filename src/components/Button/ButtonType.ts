import { ReactNode, ButtonHTMLAttributes } from 'react';

// Type definitions for Button props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    mode?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    shape?: 'rounded' | 'pill';
    btnIcon?: boolean;
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    disabled?: boolean;
    className?: string;
    tooltip?: string;
    tooltipPosition?: 'top' | 'bottom';
    fullWidth?: boolean;
    glow?: boolean;
}

export type ButtonComponentType = (props: ButtonProps) => ReactNode;
