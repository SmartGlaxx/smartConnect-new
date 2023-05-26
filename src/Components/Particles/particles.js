import Particles from "react-tsparticles";
export const ParticlesComponent = ()=>{
    
     //particles js
     const particlesInit = (main) => {
        console.log(main);
    
        // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
      };
    
      const particlesLoaded = (container) => {
        // console.log(container);
      };
    return <Particles
    id="tsparticles"
    init={particlesInit}
    loaded={particlesLoaded}
    options={{
      background: {
        color: {
          value: "243eb3"
        },
        position: "50% 50%",
        repeat: "no-repeat",
        size: "cover"
      },
      fullScreen: {
        zIndex: -1
      },
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push"
          },
          onDiv: {
            selectors: "#repulse-div",
            mode: "repulse"
          },
          onHover: {
            enable: true,
            mode: "connect",
            parallax: {
              force: 60
            }
          }
        },
        modes: {
          bubble: {
            distance: 900,
            duration: 2,
            opacity: 0.8,
            size: 40
          },
          grab: {
            distance: 900
          }
        }
      },
      particles: {
        color: {
          value: "#fff"
        },
        links: {
          color: {
            value: "#ffffff"
          },
          distance: 150,
          opacity: 0.4
        },
        move: {
          attract: {
            rotate: {
              x: 600,
              y: 1200
            }
          },
          enable: true,
          outModes: {
            bottom: "out",
            left: "out",
            right: "out",
            top: "out"
          },
          speed: 1
        },
        number: {
          density: {
            enable: true
          },
          limit: 100,
          value: 50
        },
        opacity: {
          value: 0.5,
          animation: {
            speed: 1,
            minimumValue: 0.1
          }
        },
        size: {
          random: {
            enable: true
          },
          value: {
            min: 1,
            max: 1
          },
          animation: {
            speed: 1,
            minimumValue: 0.1
          }
        }
      }
    }}
  />
}