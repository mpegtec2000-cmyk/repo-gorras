"use client";

import React from "react";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  text?: string;
  items?: string[];
  reverse?: boolean;
}

export default function Marquee({
  items = [
    "SPM® STREETWEAR",
    "DROP 01 OUT NOW",
    "BORDADOS 3D",
    "ENVÍOS A TODO CHILE",
    "ACCESORIOS & GORRAS",
    "EDICIÓN LIMITADA",
  ],
  reverse = false,
}: MarqueeProps) {
  const content = (
    <div className={styles.trackContent}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <span className={styles.item}>{item}</span>
          <span className={styles.star}>✦</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className={`${styles.marquee} ${reverse ? styles.reverse : ""}`}>
      <div className={styles.track}>
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}
