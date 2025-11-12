import React, { useState ,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useGameStore } from "../../Store/useGameStore";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
const GameSection = () => {
  const [countdown, setCountdown] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [tier, setTier] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [handleSpam, setHandleSpam] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const { saveScore, loading, fetchRecentGames } = useGameStore();
  const navigate = useNavigate();
  // overlayActive = true while counting down or actively playing
  const overlayActive = gameStarted || countdown !== null;

  // lock scroll only while overlay is active
  useEffect(() => {
    if (overlayActive) {
      // lock scroll on body + html
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      // restore
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    // cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [overlayActive]);

  // Countdown before game start
  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    } else if (countdown === 0) {
      // start playing and clear countdown (we keep overlayActive because gameStarted = true)
      setCountdown(null);
      setGameStarted(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Game timer
  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (gameStarted && timeLeft === 0) {
      // when time finishes, show result and stop game; clear countdown just in case
      setTimeout(() => {
        setShowResult(true);
        setGameStarted(false);
        setCountdown(null);
        // ensure body unlocked (overlayActive will be false after state updates)
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
         setTimeout(() => {
      const inlineSection = document.getElementById("gameSectionInline");
      if (inlineSection) {
        inlineSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 400);
      }, 600);
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft]);

  const handleStart = () => {
    setCountdown(3);
    setTimeLeft(30);
    setScore(0);
    setGameStarted(false);
    setShowResult(false);
    setTier(0);
    setShowConfetti(false);
    setHandleSpam(false);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

 
  const handleTap = () => {
    if (!gameStarted || timeLeft <= 0) return;
    const newScore = score + 1;
    setScore(newScore);


    if ((newScore === 150 && tier < 1) || (newScore === 200 && tier < 2) || (newScore === 220 && tier < 3)) {
      setTier((t) => t + 1);
      triggerConfetti();
    }
  };

   const handleSaveScore = async () => {
  setScoreSaved(false);
   await saveScore(score, setHandleSpam);
   setScoreSaved(true); // mark as saved
    
    fetchRecentGames();
  };

  const tierMessage =
    tier === 1 ? "Nice speed!" : tier === 2 ? "Great reflexes!" : tier === 3 ? "Lightning fast!" : "";

  // ----------------------------
  // Render: when overlayActive we render a fixed fullscreen overlay
  // when not overlayActive we render the normal inline result/intro so other sections are visible
  // ----------------------------
  return (
    <>
      {/* Fullscreen overlay only while counting down or playing */}
      {overlayActive && (
        <div
          id="gameOverlay"
          className="fixed inset-0 z-50 h-screen bg-linear-to-br from-[#f8f7ff] to-[#eef3ff] flex items-center justify-center overflow-hidden p-6"
          aria-hidden={false}
        >
          {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}


          <div className="flex flex-col justify-center items-center font-fredoka text-center w-full max-w-lg">
            <AnimatePresence mode="wait">
              {/* Intro while idle shouldn't show because overlayActive true only during countdown/game */}
              {/* Countdown */}
              {countdown !== null && !gameStarted && (
                <motion.div
                  key="countdownOverlay"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-7xl font-bold text-[#7c42f0] mt-20 animate-pulse"
                >
                  {countdown > 0 ? countdown : "Go!"}
                </motion.div>
              )}

              {/* Gameplay */}
              {gameStarted && (
                <motion.div
                  key="gameplayOverlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center gap-8 mt-10"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="w-[130px] h-[130px] flex items-center justify-center rounded-full bg-white shadow-lg border border-[#eee]"
                  >
                    <span className="text-3xl font-bold text-[#7c42f0]">{score}</span>
                  </motion.div>

                  <div className="px-6 py-3 bg-white rounded-full shadow-md border border-[#E4E4E7] text-[#7c42f0] font-semibold">
                    ⏱ Time Left: <span className="text-[#3494f4]">{timeLeft}s</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTap}
                    disabled={timeLeft === 0}
                    className="w-60 h-60 rounded-full bg-linear-to-br from-[#7c42f0] to-[#3494f4] text-white text-4xl font-bold shadow-[0_15px_40px_rgba(124,66,240,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 relative overflow-hidden"
                  >
                    TAP!
                  </motion.button>

                  {tierMessage && <p className="text-lg font-semibold text-[#7c42f0] mt-4">{tierMessage}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Normal page flow content (intro & result) — visible when overlay is NOT active */}
      {!overlayActive && (
        <div id="gameSectionInline" className="relative w-full flex items-center justify-center p-6 h-screen">
          <div className="flex flex-col justify-center items-center font-fredoka text-center w-full max-w-lg">
            <AnimatePresence mode="wait">
              {/* Intro (visible when not playing and no result yet) */}
              {!showResult && !gameStarted && (
                <motion.div
                  key="introInline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <h1 className="text-5xl font-extrabold bg-linear-to-r from-[#7c42f0] to-[#3494f4] bg-clip-text text-transparent drop-shadow-sm">
                    Tap Royale ⚡
                  </h1>
                  <p className="text-gray-600 mt-4 text-base">Prove your reflexes. Secure your legacy on-chain.</p>

                  <button
                    onClick={handleStart}
                    className="mt-10 bg-linear-to-r cursor-pointer from-[#7c42f0] to-[#3494f4] text-white px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Start Game
                  </button>
                </motion.div>
              )}

              {/* Result (visible after game ends) */}
              {showResult && (
                <motion.div
                  key="resultInline"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.45 }}
                  className="flex flex-col items-center justify-center mt-6"
                >
                  <h2 className="text-4xl font-bold mb-5 text-[#7c42f0]">Your Score: {score}</h2>
                  {tierMessage && <p className="text-lg text-gray-600 mb-4">{tierMessage}</p>}

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleStart}
                      className="bg-[#6676F2] cursor-pointer text-white px-8 py-2 rounded-lg font-semibold hover:bg-[#5b6ae0] transition"
                    >
                      Play Again
                    </button>

                    {!handleSpam && (
                      <button
                        disabled={loading}
                        onClick={handleSaveScore}
                        className="border border-[#7C42F0] cursor-pointer text-center flex justify-center items-center text-[#7C42F0] px-8 py-2 rounded-lg font-semibold hover:bg-[#7C42F0] hover:text-white transition"
                      >
                        {loading ? <Loader color="white"/> : "Save on Irys Network"}
                      </button>
                    )}

                      {scoreSaved && ( // ✅ New button shown after successful save
    <button
      onClick={() => navigate("/profile")}
      className="bg-linear-to-r from-[#7c42f0] cursor-pointer to-[#3494f4] text-white px-8 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-200 shadow-md"
    >
      Go to Profile →
    </button>
  )}

                    <button
                      onClick={() => {
                        const text = `⚡ I just scored ${score} in Tap Royale in 30 seconds! Can you beat me? #TapRoyale`;
                        const url = encodeURIComponent("https://tap-royale.xyz");
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
                          "_blank"
                        );
                      }}
                      className="cursor-pointer border border-[#3494f4] text-[#3494f4] px-8 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#3494f4] hover:text-white transition"
                    >
                      Share on X
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
};

export default GameSection;
