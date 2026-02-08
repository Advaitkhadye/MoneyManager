"use client";

import { motion, useInView, UseInViewOptions, Variant } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    duration?: number;
    viewport?: UseInViewOptions;
}

export const ScrollReveal = ({
    children,
    width = "fit-content",
    className = "",
    delay = 0,
    direction = "up",
    duration = 0.5,
    viewport = { once: true, amount: 0.3 }
}: ScrollRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, viewport);

    const getVariants = (): { hidden: Variant; visible: Variant } => {
        const hidden: any = { opacity: 0 };
        const visible: any = { opacity: 1 };

        switch (direction) {
            case "up":
                hidden.y = 50;
                visible.y = 0;
                break;
            case "down":
                hidden.y = -50;
                visible.y = 0;
                break;
            case "left":
                hidden.x = 50;
                visible.x = 0;
                break;
            case "right":
                hidden.x = -50;
                visible.x = 0;
                break;
            case "none":
            default:
                break;
        }

        return { hidden, visible };
    };

    const { hidden, visible } = getVariants();

    return (
        <div ref={ref} style={{ position: "relative", width }} className={className}>
            <motion.div
                variants={{
                    hidden,
                    visible
                }}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ duration, delay, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export const StaggerContainer = ({
    children,
    className = "",
    staggerDelay = 0.1,
    viewport = { once: true, amount: 0.3 }
}: {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    viewport?: UseInViewOptions;
}) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export const StaggerItem = ({ children, className = "", direction = "up" }: { children: React.ReactNode; className?: string, direction?: "up" | "down" | "none" }) => {

    const getVariants = () => {
        const hidden: any = { opacity: 0 };
        const visible: any = { opacity: 1 };

        if (direction === "up") {
            hidden.y = 30;
            visible.y = 0;
        } else if (direction === "down") {
            hidden.y = -30;
            visible.y = 0;
        }

        return { hidden, visible };
    }

    return (
        <motion.div
            variants={getVariants()}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
