export default function Wordmark({
  height = 120,
  fill = "white",
  fillOpacity = 0.87,
  stroke,
  strokeOpacity,
  strokeWidth = 5,
}) {
  let size = height / 120;
  let fillStroke = {
    fill,
    fillOpacity,
    stroke,
    strokeOpacity,
    strokeWidth,
  };
  return (
    <svg
      width={294 * size}
      height={120 * size}
      viewBox="0 0 294 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.157 27.7C25.1768 26.94 27.3544 26.56 29.6898 26.56C35.3073 26.56 38.1161 29.125 38.1161 34.255C38.1161 37.0417 37.8005 41.6333 37.1693 48.03C36.5381 54.3633 36.2225 60.95 36.2225 67.79C36.2225 74.63 36.4435 80.2983 36.8853 84.795C38.5895 84.985 40.2937 85.08 41.9979 85.08C50.3296 85.08 57.6513 83.6867 63.9632 80.9C64.7206 82.61 65.0993 84.5417 65.0993 86.695C65.0993 88.8483 64.3419 90.7167 62.8271 92.3C61.3753 93.82 59.5764 94.58 57.4304 94.58C52.949 94.58 43.134 94.2 27.9856 93.44C26.7863 93.3767 25.7448 93.0283 24.8612 92.395C23.9775 91.6983 23.5357 90.8433 23.5357 89.83C23.5357 86.4733 23.7882 80.805 24.2931 72.825C24.8612 64.845 25.1452 57.4983 25.1452 50.785C25.1452 44.0083 24.4825 36.3133 23.157 27.7Z"
        {...fillStroke}
      />
      <path
        d="M110.668 62.47L120.799 61.71C124.586 61.71 126.479 63.6417 126.479 67.505C126.479 69.7217 126.195 73.1733 125.627 77.86C125.059 82.5467 124.775 86.3467 124.775 89.26C123.197 89.5133 119.663 90.4633 114.171 92.11C108.743 93.7567 104.198 94.58 100.538 94.58C91.5748 94.58 84.7895 91.7933 80.1818 86.22C75.6373 80.6467 73.365 73.0467 73.365 63.42C73.365 56.58 74.5958 50.31 77.0575 44.61C79.5822 38.91 83.3062 34.2867 88.2295 30.74C93.1527 27.1933 98.5809 25.42 104.514 25.42C110.51 25.42 115.497 26.8133 119.473 29.6C123.513 32.3867 125.533 36.155 125.533 40.905C125.533 43.565 124.744 45.8133 123.166 47.65C121.651 49.4233 119.694 50.31 117.296 50.31C114.897 50.31 113.224 50.025 112.278 49.455C112.467 48.315 112.562 47.175 112.562 46.035C112.562 42.6783 111.615 39.955 109.721 37.865C107.828 35.7117 105.145 34.635 101.674 34.635C98.2022 34.635 94.9201 35.8067 91.8272 38.15C89.9968 40.7467 88.5766 44.2933 87.5667 48.79C86.5568 53.2867 86.0519 57.6567 86.0519 61.9C86.0519 68.74 87.3774 74.3767 90.0284 78.81C92.6793 83.18 96.8767 85.365 102.621 85.365C106.849 85.365 110.794 84.13 114.455 81.66C114.708 79.19 114.834 75.6433 114.834 71.02C112.309 71.78 110.353 72.16 108.964 72.16C105.492 72.16 103.757 70.3233 103.757 66.65C103.757 65.0667 104.072 63.3883 104.703 61.615C106.408 62.185 108.396 62.47 110.668 62.47Z"
        {...fillStroke}
      />
      <path
        d="M144.316 26.275L164.293 26.56C174.645 26.56 182.219 26.18 187.016 25.42C187.711 26.75 188.058 28.27 188.058 29.98C188.058 31.69 187.3 33.2417 185.785 34.635C184.271 35.965 182.44 36.63 180.294 36.63L169.406 35.395C169.406 35.8383 169.248 37.8017 168.933 41.285C168.049 49.835 167.607 58.4167 167.607 67.03C167.607 75.6433 168.27 84.2567 169.595 92.87C167.513 93.63 165.335 94.01 163.063 94.01C160.79 94.01 158.834 93.3767 157.193 92.11C155.552 90.78 154.731 88.8167 154.731 86.22C154.731 83.56 155.047 78.905 155.678 72.255C156.309 65.605 156.625 59.145 156.625 52.875C156.625 46.5417 156.309 40.6517 155.678 35.205C148.04 35.585 142.076 36.6617 137.784 38.435C137.026 36.9783 136.648 35.3633 136.648 33.59C136.648 31.7533 137.373 30.075 138.825 28.555C140.277 27.035 142.107 26.275 144.316 26.275Z"
        {...fillStroke}
      />
      <path
        d="M267.151 31.88L266.677 47.555C266.677 56.1683 266.93 63.895 267.435 70.735C267.94 77.5117 269.076 84.89 270.843 92.87C269.454 94.01 267.245 94.58 264.216 94.58C258.346 94.58 255.411 92.015 255.411 86.885C255.411 82.6417 255.6 76.15 255.979 67.41C256.42 58.67 256.641 51.83 256.641 46.89C253.233 51.83 249.635 57.9417 245.848 65.225C242.124 72.445 240.262 76.8783 240.262 78.525C240.262 80.1717 240.42 81.4383 240.735 82.325C239.347 83.2117 237.485 83.655 235.149 83.655C232.877 83.655 230.952 83.0217 229.374 81.755C227.859 80.4883 226.565 78.7467 225.492 76.53C224.482 74.3133 222.652 69.975 220.001 63.515C217.413 56.9917 215.046 51.3867 212.9 46.7C211.259 56.8967 210.439 65.9217 210.439 73.775C210.439 81.6283 210.691 87.9933 211.196 92.87C209.176 93.63 207.156 94.01 205.137 94.01C201.097 94.01 199.077 91.9833 199.077 87.93C199.077 84.8267 199.771 78.6517 201.16 69.405C202.612 60.095 203.338 52.2417 203.338 45.845C203.338 39.4483 202.991 33.4633 202.296 27.89C205.705 27.0033 208.356 26.56 210.249 26.56C213.721 26.56 216.056 27.795 217.255 30.265C219.149 34.255 221.926 40.62 225.587 49.36C229.311 58.0367 232.341 64.7183 234.676 69.405C235.307 68.075 236.759 65.225 239.031 60.855C241.367 56.4217 243.292 52.6533 244.807 49.55C246.385 46.3833 247.963 42.6467 249.541 38.34C251.182 33.97 252.223 30.17 252.665 26.94C254.937 26.3067 257.146 25.99 259.292 25.99C261.502 25.99 263.364 26.465 264.878 27.415C266.393 28.365 267.151 29.8533 267.151 31.88Z"
        {...fillStroke}
      />
    </svg>
  );
}