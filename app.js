/**
 * Abhishek Sharma - DevOps Portfolio Application JS
 * Highly interactive components: Canvas Particles, Terminal Console, Pipeline Simulator, AWS diagram
 */

/* ==========================================================================
   1. Canvas Particle System (Network Node Simulation)
   ========================================================================== */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let animationFrameId = null;

// Mouse coordinates
const mouse = {
    x: null,
    y: null,
    radius: 120 // Interaction radius
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Draw single particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Update particle position & handle screen bounces and mouse interaction
    update() {
        // Boundary check
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Mouse collision / avoidance physics
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius + this.size) {
                // Calculate push force
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxForce = 3;
                const force = (mouse.radius - distance) / mouse.radius;
                
                this.x -= forceDirectionX * force * maxForce;
                this.y -= forceDirectionY * force * maxForce;
            }
        }

        // Float particles
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
    }
}

// Populate particle array based on viewport area
function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    numberOfParticles = Math.min(numberOfParticles, 120); // Cap particles

    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1; // 1 to 3 pixels
        let x = Math.random() * (window.innerWidth - size * 2) + size;
        let y = Math.random() * (window.innerHeight - size * 2) + size;
        
        // Speed
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        
        // Color mapping - subtle cyan, purple and dark shades
        let colors = [
            'rgba(0, 242, 254, 0.45)', // Cyan
            'rgba(189, 0, 255, 0.35)', // Purple
            'rgba(143, 156, 174, 0.2)'  // Grey
        ];
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Draw connections between close particles
function connectParticles() {
    let maxDistance = 115;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                // Fade line opacity based on distance
                let alpha = (1 - (distance / maxDistance)) * 0.12;
                ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectParticles();
    animationFrameId = requestAnimationFrame(animateParticles);
}

// Handle resize event
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Start canvas system
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
initParticles();
animateParticles();


/* ==========================================================================
   2. Scroll & UI Element Handlers (Nav bar shrink, mobile menu)
   ========================================================================== */
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

// Shrink header on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll Spy: Highlight active nav link
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 120) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = mobileToggle.querySelector('i');
    if (navMenu.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
    } else {
        icon.className = 'fa-solid fa-bars';
    }
});

// Close mobile menu when clicking nav items
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
});


/* ==========================================================================
   3. Interactive Terminal Command Console
   ========================================================================== */
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');
const presetBtns = document.querySelectorAll('.preset-btn');

// Command database
const commands = {
    help: () => `Available commands:
  whoami          - Brief overview profile of Abhishek Sharma
  skills          - Detail of DevOps, Cloud & Development skills
  projects        - Overview of provisioned AWS Drop Shipping project
  experience      - Review work history at Simplify Healthcare
  certifications  - List active course certifications (AZ-900, AWS, etc.)
  pipeline        - Run the simulated CI/CD build & deploy pipeline
  cat info.txt    - Display contact routes & endpoint details
  clear           - Wipe terminal logs`,

    whoami: () => `guest@devops-node:~$ whoami
NAME: Abhishek Sharma
ROLE: DevOps Engineer
PROFILE SUMMARY: DevOps Engineer with hands-on experience in cloud infrastructure, application deployment, and system monitoring. Skilled in CI/CD pipelines, containerization (Docker, Kubernetes), and release management. Strong SQL Server database and production support experience.`,

    skills: () => `guest@devops-node:~$ kubectl get skills -o wide
CATEGORY             SKILLSET
AWS                  EC2, VPC, Availability Zone, S3, IAM, Security Groups, Lambda, Load Balancer
Azure                VM, Blob Storage, App Service, Key Vault, SQL Servers, Elastic Pool, Storage Accounts
DevOps / CI-CD       Terraform (IaC), Kubernetes, Docker, Git/GitHub, Jenkins, Azure DevOps
Databases            SQL Server Admin, SSMS, Redgate, PGAdmin, MongoDB Compass, IIS Web Server
Languages & Dev      Python, C/C++, .Net, Django
AI & ITSM            Prompting, SIEM monitoring, GLPI Ticketing, ITIL, System Troubleshooting`,

    projects: () => `guest@devops-node:~$ terraform show -module=dropshipping
MODULE: Project - Drop Shipping (AWS infrastructure)
STATUS: Deployed successfully (Active)
DESCRIPTION: Provisioned 40+ AWS services using modular Terraform from scratch.
ARCHITECTURAL METRICS:
  - 1 Virtual Private Cloud (VPC) with public/private subnetting.
  - Multi-AZ Web Application Load Balancer (ALB) + EC2 Auto Scaling Groups.
  - Secure SQL Relational Database (RDS Multi-AZ).
  - CloudWatch metric monitoring & alarms integration.
  - Cost optimized through custom pricing configurations.`,

    experience: () => `guest@devops-node:~$ cat experience.log
[01/2023 - Present] Simplify Healthcare - Associate Application Deployment Engineer
PROJECT: Multi Project Environment
TASKS DELIVERED:
  * Managed container workloads on Docker & Kubernetes cluster nodes.
  * Deployed apps onto Azure App Services; administered storage configurations.
  * Administered SQL database jobs, Bacpac migrations, and backups.
  * Configured SIEM and Azure Alerts mapping memory, CPU, and Disk metrics.
  * Handled daily production deployments; troubleshoot pipeline blockers.`,

    certifications: () => `guest@devops-node:~$ get-certifications
ACTIVE BADGES:
  - Generative AI Foundation (June 2025) - Microsoft & upGrad
  - Microsoft Azure Fundamentals AZ-900 (October 2025)
  - AWS Certification (March 2026) - Cloud&DevOpsHUB
  - Cyber Security Tools & Attacks (August 2020) - Coursera
  - MNA + CloudV2 (June 2019) - Jetking`,

    "cat info.txt": () => `guest@devops-node:~$ cat info.txt
ENDPOINT CONTACT ROUTES:
  - Email:      as787145@gmail.com
  - Phone:      +91 8308989160
  - LinkedIn:   https://www.linkedin.com/in/as787145
  - Github:     https://github.com/abhisheksharma (simulated)
  - Cluster:    visitor-prod-1`,

    pipeline: () => {
        // Trigger the pipeline visualizer component
        setTimeout(() => {
            const pipelineSection = document.getElementById('pipeline-section');
            if (pipelineSection) {
                pipelineSection.scrollIntoView({ behavior: 'smooth' });
                runPipelineSimulation();
            }
        }, 300);
        return `guest@devops-node:~$ npm run pipeline
[SYSTEM] Redirecting viewport context to CI/CD pipeline controller...`;
    }
};

// Handle CLI submission
function handleCommand(cmdText) {
    const trimmed = cmdText.trim();
    if (!trimmed) return;

    // Create line showing command typed
    appendTerminalLine(`<span class="prompt">guest@devops-node:~$</span> ${escapeHTML(trimmed)}`);

    const lower = trimmed.toLowerCase();
    
    if (lower === 'clear') {
        terminalBody.innerHTML = `
            <div class="terminal-line text-system">System logs cleared. Session active.</div>
        `;
    } else if (commands[lower]) {
        const output = commands[lower]();
        appendTerminalLine(output, 'terminal-output');
    } else if (lower === 'kubectl get nodes') {
        appendTerminalLine(`guest@devops-node:~$ kubectl get nodes
NAME             STATUS   ROLES    AGE   VERSION
k8s-master-01    Ready    control  320d  v1.28.2
k8s-worker-01    Ready    worker   320d  v1.28.2
k8s-worker-02    Ready    worker   320d  v1.28.2`, 'terminal-output');
    } else if (lower === 'terraform init') {
        appendTerminalLine(`guest@devops-node:~$ terraform init
Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/aws versions >= 4.0.0...
- Finding hashicorp/azurerm versions >= 3.0.0...
Terraform has been successfully initialized!`, 'terminal-output');
    } else {
        appendTerminalLine(`bash: command not found: ${escapeHTML(trimmed)}. Type 'help' for options.`, 'text-error');
    }

    terminalInput.value = '';
    terminalBody.scrollTop = terminalBody.scrollHeight; // Scroll to bottom
}

function appendTerminalLine(text, className = '') {
    const div = document.createElement('div');
    div.className = `terminal-line ${className}`;
    div.innerHTML = text.replace(/\n/g, '<br>');
    terminalBody.appendChild(div);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Input listeners
terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleCommand(terminalInput.value);
    }
});

// Preset buttons trigger
presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd === 'clear') {
            handleCommand('clear');
        } else {
            handleCommand(cmd);
        }
    });
});


/* ==========================================================================
   4. DevOps CI/CD Pipeline Simulator
   ========================================================================== */
const runPipelineBtn = document.getElementById('run-pipeline-btn');
const clearLogsBtn = document.getElementById('clear-logs-btn');
const pipelineLogs = document.getElementById('pipeline-logs');
const pipelineStatusText = document.getElementById('pipeline-status-text');

const stages = {
    source: document.getElementById('stage-source'),
    build: document.getElementById('stage-build'),
    test: document.getElementById('stage-test'),
    deploy: document.getElementById('stage-deploy')
};

let pipelineRunning = false;

function addLogLine(text, type = '') {
    const div = document.createElement('div');
    div.className = `log-line ${type}`;
    // Timestamp
    const now = new Date().toISOString().slice(11, 19);
    div.innerHTML = `<span class="text-muted">[${now}]</span> ${text}`;
    pipelineLogs.appendChild(div);
    pipelineLogs.scrollTop = pipelineLogs.scrollHeight;
}

function resetPipelineStages() {
    Object.values(stages).forEach(stage => {
        stage.className = 'pipeline-stage';
        stage.querySelector('.stage-status').textContent = 'Pending';
        stage.querySelector('.progress-fill').style.width = '0%';
    });
}

function runPipelineSimulation() {
    if (pipelineRunning) return;
    
    pipelineRunning = true;
    runPipelineBtn.disabled = true;
    pipelineStatusText.className = 'status-running';
    pipelineStatusText.textContent = 'RUNNING';
    
    // Reset stages first
    resetPipelineStages();
    pipelineLogs.innerHTML = '';
    
    addLogLine('Initializing deployment job ID: job-hash-88916...', 'text-cyan');
    
    // Timeline of pipeline execution steps
    const timeline = [
        // --- 1. SOURCE STAGE ---
        {
            delay: 1000,
            action: () => {
                stages.source.classList.add('active');
                stages.source.querySelector('.stage-status').textContent = 'Fetching...';
                addLogLine('Fetching source repository from origin/main...');
            }
        },
        {
            delay: 2200,
            action: () => {
                stages.source.querySelector('.progress-fill').style.width = '100%';
                addLogLine('Git webhook signature verified.');
                addLogLine('Commit ref: <span class="text-cyan">f34d19b</span> (Author: Abhishek Sharma)');
            }
        },
        {
            delay: 3000,
            action: () => {
                stages.source.classList.remove('active');
                stages.source.classList.add('success');
                stages.source.querySelector('.stage-status').textContent = 'Completed';
                addLogLine('Source code pulled successfully.', 'text-success');
            }
        },
        // --- 2. BUILD STAGE ---
        {
            delay: 4000,
            action: () => {
                stages.build.classList.add('active');
                stages.build.querySelector('.stage-status').textContent = 'Building...';
                addLogLine('Loading Docker Daemon... Host OS is ready.');
                addLogLine('Running command: <code>docker build -t abhishek-portfolio:latest .</code>');
            }
        },
        {
            delay: 5000,
            action: () => {
                stages.build.querySelector('.progress-fill').style.width = '35%';
                addLogLine('Step 1/4: Pulling alpine base node image...');
            }
        },
        {
            delay: 6000,
            action: () => {
                stages.build.querySelector('.progress-fill').style.width = '70%';
                addLogLine('Step 2/4: Copying files & Installing static dependencies...');
            }
        },
        {
            delay: 7200,
            action: () => {
                stages.build.querySelector('.progress-fill').style.width = '100%';
                addLogLine('Step 3/4: Compiling static production bundle...');
                addLogLine('Step 4/4: Exposing ports config and compressing image...');
            }
        },
        {
            delay: 8000,
            action: () => {
                stages.build.classList.remove('active');
                stages.build.classList.add('success');
                stages.build.querySelector('.stage-status').textContent = 'Built';
                addLogLine('Container image built successfully: abhishek-portfolio:latest (124MB)', 'text-success');
            }
        },
        // --- 3. TEST STAGE ---
        {
            delay: 9000,
            action: () => {
                stages.test.classList.add('active');
                stages.test.querySelector('.stage-status').textContent = 'Testing...';
                addLogLine('Launching Jest automated testing workspace...');
            }
        },
        {
            delay: 10000,
            action: () => {
                stages.test.querySelector('.progress-fill').style.width = '50%';
                addLogLine('PASS: tests/performance.test.js (1.1s)');
                addLogLine('PASS: tests/routes.test.js (0.4s)');
            }
        },
        {
            delay: 11000,
            action: () => {
                stages.test.querySelector('.progress-fill').style.width = '100%';
                addLogLine('Running security container vulnerability scan...');
                addLogLine('<span class="text-success">[VULNERABILITIES]</span> 0 discovered (Critical: 0, High: 0)');
            }
        },
        {
            delay: 11800,
            action: () => {
                stages.test.classList.remove('active');
                stages.test.classList.add('success');
                stages.test.querySelector('.stage-status').textContent = 'Passed';
                addLogLine('All test suits succeeded. Container scan clean.', 'text-success');
            }
        },
        // --- 4. DEPLOY STAGE ---
        {
            delay: 12800,
            action: () => {
                stages.deploy.classList.add('active');
                stages.deploy.querySelector('.stage-status').textContent = 'Deploying...';
                addLogLine('Establishing connection context to Kubernetes cluster...');
                addLogLine('Applying K8s resources via: <code>kubectl apply -f deployment/</code>');
            }
        },
        {
            delay: 13800,
            action: () => {
                stages.deploy.querySelector('.progress-fill').style.width = '60%';
                addLogLine('ReplicaSet scaled: creating 3 healthy pod replicas...');
                addLogLine('Pod k8s-portfolio-8991a successfully started.');
                addLogLine('Pod k8s-portfolio-8991b successfully started.');
            }
        },
        {
            delay: 14800,
            action: () => {
                stages.deploy.querySelector('.progress-fill').style.width = '100%';
                addLogLine('Configuring LoadBalancer ingress endpoint routes...');
                addLogLine('Ingress health checks: [HEALTHY]');
            }
        },
        {
            delay: 15600,
            action: () => {
                stages.deploy.classList.remove('active');
                stages.deploy.classList.add('success');
                stages.deploy.querySelector('.stage-status').textContent = 'Deployed';
                addLogLine('Deployment Rollout completed successfully!', 'text-success');
                addLogLine('<span class="text-cyan">========================================================</span>');
                addLogLine('<strong>APP RUNNING ON:</strong> <a href="#" style="color: var(--accent-cyan);">https://abhishek-sharma.devops</a>');
                addLogLine('<span class="text-cyan">========================================================</span>');
                
                // Pipeline complete
                pipelineRunning = false;
                runPipelineBtn.disabled = false;
                pipelineStatusText.className = 'status-success';
                pipelineStatusText.textContent = 'SUCCESS';
            }
        }
    ];

    // Schedule all steps
    timeline.forEach(step => {
        setTimeout(step.action, step.delay);
    });
}

runPipelineBtn.addEventListener('click', runPipelineSimulation);

clearLogsBtn.addEventListener('click', () => {
    if (pipelineRunning) return;
    pipelineLogs.innerHTML = '<div class="log-line text-muted">[System] Ready to run build task. Waiting...</div>';
});


/* ==========================================================================
   5. Interactive Infrastructure Map (Drop Shipping Project)
   ========================================================================== */
const infraNodes = document.querySelectorAll('.infra-node');
const detailTitle = document.querySelector('.detail-node-title');
const detailDesc = document.querySelector('.detail-node-desc');
const tfCode = document.getElementById('terraform-code');

// Node Information & Terraform Snippets database
const nodeData = {
    "node-alb": {
        title: "Application Load Balancer (ALB)",
        desc: "An AWS Application Load Balancer configured to handle external client web traffic. It termination TLS certificates and routes HTTP requests across two separate Availability Zones to instances inside Auto-Scaling groups, securing maximum application uptime.",
        tf: `resource "aws_lb" "web_alb" {
  name               = "dropshipping-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [for s in aws_subnet.public : s.id]

  tags = {
    Environment = "production"
    Application = "dropshipping"
  }
}`
    },
    "node-ec2": {
        title: "EC2 Web & App Scaling Group",
        desc: "Web servers running on AWS EC2 instances, structured in Auto Scaling Groups across multiple Availability Zones. Scaling parameters automatically increase instance capacity when CPU utilization meets 75% or decrease capacity to conserve cost.",
        tf: `resource "aws_autoscaling_group" "web_asg" {
  name_prefix         = "dropshipping-web-asg"
  desired_capacity    = 2
  max_size            = 5
  min_size            = 2
  vpc_zone_identifier = [for s in aws_subnet.public : s.id]
  target_group_arns   = [aws_lb_target_group.web_tg.arn]

  launch_template {
    id      = aws_launch_template.web_tmpl.id
    version = "$Latest"
  }
}`
    },
    "node-rds": {
        title: "RDS Multi-AZ Relational Database",
        desc: "A fully-managed Amazon RDS SQL Server instance configured inside private subnets for high security. Deployed with Multi-AZ configuration to automatically replicate transactions to a standby replica node in a separate zone for instant failover capability.",
        tf: `resource "aws_db_instance" "production_db" {
  identifier           = "dropshipping-rds-prod"
  allocated_storage    = 20
  engine               = "sqlserver-ex"
  engine_version       = "15.00"
  instance_class       = "db.t3.medium"
  db_subnet_group_name = aws_db_subnet_group.db_subnet.name
  multi_az             = true
  username             = "sa_admin"
  password             = var.db_password
  skip_final_snapshot  = true
}`
    },
    "node-s3": {
        title: "Amazon S3 Static Assets Storage",
        desc: "Simple Storage Service bucket that holds application media assets, logs, and static templates. Configured with strict IAM access policies, default server-side AES-256 encryption, and lifecycle policies that transition old logs to Glacier to minimize overhead cost.",
        tf: `resource "aws_s3_bucket" "assets_bucket" {
  bucket = "dropshipping-prod-assets-sharma"

  tags = {
    Environment = "Production"
    DataType    = "StaticAssets"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "s3_encrypt" {
  bucket = aws_s3_bucket.assets_bucket.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}`
    },
    "node-cw": {
        title: "CloudWatch Operations Monitor",
        desc: "Amazon CloudWatch serves as the centralized logging and alerting hub. Deployed dashboards gather metrics from the ALB and Auto-Scaling groups, firing off SNS notifications to the operations support team when critical system spikes occur.",
        tf: `resource "aws_cloudwatch_metric_alarm" "cpu_utilization_high" {
  alarm_name          = "web-ec2-cpu-high-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "75"
  alarm_description   = "This alarm triggers scaling policy when CPU >= 75%"
  alarm_actions       = [aws_sns_topic.operations_alerts.arn]
}`
    }
};

// Bind click events to elements
infraNodes.forEach(node => {
    // Exclude the client node which is just a graphical source
    if (node.id === 'node-client') return;

    node.addEventListener('click', () => {
        // Toggle highlight class
        infraNodes.forEach(n => n.classList.remove('active-node'));
        node.classList.add('active-node');

        const key = node.id;
        const data = nodeData[key];

        if (data) {
            // Animate transition smoothly
            const panel = document.getElementById('diagram-details');
            panel.style.opacity = 0.3;
            panel.style.transform = 'translateY(5px)';
            
            setTimeout(() => {
                detailTitle.textContent = data.title;
                detailDesc.textContent = data.desc;
                tfCode.textContent = data.tf;
                
                panel.style.opacity = 1;
                panel.style.transform = 'translateY(0)';
            }, 150);
        }
    });
});


/* ==========================================================================
   6. Contact Manifest Submission Simulation
   ========================================================================== */
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback-message');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-manifest-btn');
    const originalText = submitBtn.innerHTML;
    
    // Simulate deployment loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deploying...';
    formFeedback.className = 'form-feedback';
    formFeedback.style.display = 'none';

    setTimeout(() => {
        // Mock successful deployment of manifest
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = '<i class="fa-solid fa-check"></i> connectionrequest.v1.yaml applied successfully. Gateway response: Message delivered.';
        formFeedback.style.display = 'block';
        
        // Reset inputs
        contactForm.reset();
        
        // Auto fadeout notification
        setTimeout(() => {
            formFeedback.style.display = 'none';
        }, 6000);
    }, 1800);
});
