import { useRef, useEffect } from 'react';
import styles from './DonutChart.module.scss';

interface IProps {
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  unknownPercentage: number;
}

const svgPositive = (
  <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3.95886" cy="4.43945" r="3.75" fill="#38D86E" />
  </svg>
);

const svgNegative = (
  <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3.95886" cy="4.43945" r="3.75" fill="#F53467" />
  </svg>
);

const svgNeutral = (
  <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3.95886" cy="4.43945" r="3.25" fill="#F7C360" stroke="#EAEEF4" />
  </svg>
);

const svgUnknown = (
  <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="3.95886" cy="4.43945" r="3.25" fill="#F6F9FF" stroke="#EAEEF4" />
  </svg>
);

const DonutChart = ({ neutralPercentage, positivePercentage, negativePercentage, unknownPercentage }: IProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    console.log('canvas', canvas);
    console.log('ctx', ctx);
    if (ctx && canvas) {
      ctx.imageSmoothingEnabled = true;

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) / 2 - 20;
      const strokeWidth = 25;

      const positiveAngle = (positivePercentage / 100) * 2 * Math.PI;
      const negativeAngle = (negativePercentage / 100) * 2 * Math.PI;
      const neutralAngle = (neutralPercentage / 100) * 2 * Math.PI;
      const unknownAngle = (unknownPercentage / 100) * 2 * Math.PI;

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, neutralAngle);
      ctx.strokeStyle = '#F7C360';
      ctx.lineWidth = strokeWidth;
      ctx.stroke();

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#EAABF0'); // Начальный цвет градиента
      gradient.addColorStop(1, '#38D86E'); // Конечный цвет градиента

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, neutralAngle, neutralAngle + positiveAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();

      //Negative
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, neutralAngle + positiveAngle, neutralAngle + positiveAngle + negativeAngle);
      ctx.strokeStyle = '#F53467';
      ctx.lineWidth = strokeWidth;
      ctx.stroke();

      // Draw unknown segment
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        radius,
        neutralAngle + positiveAngle + negativeAngle,
        neutralAngle + positiveAngle + negativeAngle + unknownAngle,
      );
      ctx.strokeStyle = '#F6F9FF';
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  }, [neutralPercentage, positivePercentage, negativePercentage, unknownPercentage]);

  const round = (n: number) => {
    return n.toFixed(2);
  };

  return (
    <div className={styles.chartContainer}>
      <canvas ref={canvasRef} width={150} height={150} />
      <div className={styles.legend}>
        <div className={styles.legendItem} color="#28a745">
          <div className={styles.legendTextBlock}>
            <span>{svgPositive}</span>
            <span className={styles.legendText}>Positive: {round(positivePercentage)}%</span>
          </div>
        </div>
        <div className={styles.legendItem} color="#dc3545">
          <div className={styles.legendTextBlock}>
            <span>{svgNegative}</span>
            <span className={styles.legendText}>Negative: {round(negativePercentage)}%</span>
          </div>
        </div>
        <div className={styles.legendItem} color="#d3d3d3">
          <div className={styles.legendTextBlock}>
            <span>{svgNeutral}</span>
            <span className={styles.legendText}>Neutral: {round(neutralPercentage)}%</span>
          </div>
        </div>
        <div className={styles.legendItem} color="#d3d3d3">
          <div className={styles.legendTextBlock}>
            <span>{svgUnknown}</span>
            <span className={styles.legendText}>Unknown: {round(unknownPercentage)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
