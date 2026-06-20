/**
 * Abhishek Sharma - CloudOps Dashboard console JS
 * Logic: Live updating telemetry chart, Kubernetes Pod tabs, Sandbox runner, and blueprint configs
 */

/* ==========================================================================
   1. Live Telemetry Canvas (Fluctuating Telemetry Chart)
   ========================================================================== */
const metricsCanvas = document.getElementById('live-telemetry-canvas');
if (metricsCanvas) {
    const mCtx = metricsCanvas.getContext('2d');
    
    // Set display buffer sizes
    function resizeCanvas() {
        const rect = metricsCanvas.getBoundingClientRect();
        metricsCanvas.width = rect.width;
        metricsCanvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial telemetry data queue (20 points)
    let telemetryPoints = Array.from({ length: 22 }, () => Math.floor(Math.random() * 15) + 10);
    const cpuLoadVal = document.getElementById('cpu-load-val');
    const cpuLoadBar = document.getElementById('cpu-load-bar');

    function drawChart() {
        if (!metricsCanvas.width) return;
        mCtx.clearRect(0, 0, metricsCanvas.width, metricsCanvas.height);

        // Draw background grid lines inside canvas
        mCtx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        mCtx.lineWidth = 1;
        const gridLines = 4;
        for (let i = 1; i <= gridLines; i++) {
            const y = (metricsCanvas.height / (gridLines + 1)) * i;
            mCtx.beginPath();
            mCtx.moveTo(0, y);
            mCtx.lineTo(metricsCanvas.width, y);
            mCtx.stroke();
        }

        const pointCount = telemetryPoints.length;
        const stepX = metricsCanvas.width / (pointCount - 1);
        
        // Map points to canvas height (0 - 100 max CPU load)
        const points = telemetryPoints.map((val, idx) => {
            const x = idx * stepX;
            // Scale so 100% CPU is near top, 0% is near bottom
            const y = metricsCanvas.height - (val / 100) * (metricsCanvas.height * 0.85) - 10;
            return { x, y };
        });

        // Draw fill area first
        const gradient = mCtx.createLinearGradient(0, 0, 0, metricsCanvas.height);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)'); // Emerald transparent
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
        
        mCtx.beginPath();
        mCtx.moveTo(0, metricsCanvas.height);
        points.forEach(pt => mCtx.lineTo(pt.x, pt.y));
        mCtx.lineTo(metricsCanvas.width, metricsCanvas.height);
        mCtx.closePath();
        mCtx.fillStyle = gradient;
        mCtx.fill();

        // Draw line path
        mCtx.beginPath();
        mCtx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            // Smooth curve mapping (bezier control points)
            const xc = (points[i - 1].x + points[i].x) / 2;
            const yc = (points[i - 1].y + points[i].y) / 2;
            mCtx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }
        mCtx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        mCtx.strokeStyle = '#10b981'; // Emerald solid line
        mCtx.lineWidth = 2;
        mCtx.stroke();

        // Draw neon glow dot on the last point
        const lastPt = points[points.length - 1];
        mCtx.beginPath();
        mCtx.arc(lastPt.x - 2, lastPt.y, 4, 0, Math.PI * 2);
        mCtx.fillStyle = '#10b981';
        mCtx.shadowColor = '#10b981';
        mCtx.shadowBlur = 8;
        mCtx.fill();
        // Reset shadow
        mCtx.shadowBlur = 0;
    }

    // Telemetry tick updater
    setInterval(() => {
        // Fluctuating value around previous point to avoid sudden jumps
        const lastVal = telemetryPoints[telemetryPoints.length - 1];
        let diff = (Math.random() * 10) - 5; // -5 to +5
        let newVal = Math.round(lastVal + diff);
        
        // Clamp boundaries between 8% and 40% CPU loads
        newVal = Math.max(8, Math.min(newVal, 40));
        
        telemetryPoints.shift();
        telemetryPoints.push(newVal);

        // Update labels
        if (cpuLoadVal) cpuLoadVal.textContent = `${newVal}%`;
        if (cpuLoadBar) {
            cpuLoadBar.style.width = `${newVal}%`;
            // Color shifts based on high load spikes (just a nice details)
            if (newVal > 30) {
                cpuLoadBar.style.background = 'var(--accent-amber)';
            } else {
                cpuLoadBar.style.background = 'var(--accent-indigo)';
            }
        }

        drawChart();
    }, 1500);

    drawChart();
}


/* ==========================================================================
   2. Kubernetes Pods Namespace Skills Selector
   ========================================================================== */
// Pods dataset representing Abhishek's skillset
const namespacePods = {
    infra: [
        {
            id: "terraform",
            name: "pod/terraform-operator",
            version: "v1.6.2",
            desc: "Declarative Infrastructure as Code (IaC) to construct repeatable resources. Built VPCs, EC2 instances, security rules, and databases cleanly without manual drift.",
            logs: `[INFO] Initializing terraform provider plugins...
[INFO] Terraform AWS provider: version v5.12.0 loaded.
[INFO] State Backend: remote s3 storage (dropshipping-state-bucket) verified.
[INFO] Refreshing terraform state mapping...
[INFO] 40+ resources discovered in state file.
[SUCCESS] State matches cloud records. 0 changes required.`
        },
        {
            id: "aws",
            name: "pod/aws-cloud-controller",
            version: "v2026.1",
            desc: "Expertise in core AWS service architectures: VPC subnets configuration, Route53 DNS management, Application Load Balancers (ALBs), and EC2 computing profiles.",
            logs: `[INFO] Requesting IAM session credentials...
[INFO] Identity authenticated: arn:aws:iam::88914022:user/abhishek
[INFO] Querying subnet layouts inside ap-south-1...
[INFO] Subnet ap-south-1a (Public): Active / CIDR 10.0.1.0/24
[INFO] Subnet ap-south-1b (Private): Active / CIDR 10.0.10.0/24
[INFO] Status: VPC network path routing validated.`
        },
        {
            id: "azure",
            name: "pod/azure-resource-manager",
            version: "v3.85.0",
            desc: "Deploying resources inside Azure App Services, configuring Storage Accounts, Blob containers, and SQL Server instances connected via Elastic Pools.",
            logs: `[INFO] Authenticated with Azure Active Directory.
[INFO] Active subscription: Prod-DevOps-Subscription (Active)
[INFO] Checking app service hosts: 3 running workloads.
[INFO] Azure App Service "production-web-host" reports 100% health check passes.
[INFO] Storage accounts synced. 0 latency flags.`
        }
    ],
    containers: [
        {
            id: "k8s",
            name: "pod/kubernetes-service-controller",
            version: "v1.28.4",
            desc: "Managing container nodes clusters. Deploying Pod configs, setting Service interfaces, scaling deployment replicas, and monitoring operational pods status.",
            logs: `[INFO] kubectl describe deployment web-app-deployment
Name:                   web-app-deployment
Namespace:              production-apps
Replicas:               3 desired | 3 updated | 3 total | 3 available
Conditions:             Available: True (MinimumReplicasAvailable)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ---   ----                   -------
  Normal  ScalingReplicaSet  12m   deployment-controller  Scaled replica set to 3`
        },
        {
            id: "docker",
            name: "pod/docker-runtime-engine",
            version: "v24.0.9",
            desc: "Constructing multi-stage optimized Dockerfiles to compress deployment base layers. Executing local testing containers and managing image releases registries.",
            logs: `[INFO] docker build -t abhishek-portfolio:latest .
Sending build context to Docker daemon  32.4MB
Step 1/3 : FROM node:20-alpine AS builder -> Using cache
Step 2/3 : COPY . . -> Done (0.8s)
Step 3/3 : RUN npm run build -> Success (2.4s)
Successfully built image: sha256:d892a01d44bc (124MB)`
        },
        {
            id: "ghactions",
            name: "pod/github-actions-runner",
            version: "v2.312.0",
            desc: "Designing secure GitHub actions YAML files. Setting permissions scopes, caches parameters, and deploying build artifacts onto target server endpoints.",
            logs: `[INFO] Run actions/checkout@v4
[INFO] Syncing git commit history to runner...
[INFO] Run actions/setup-node@v4
[INFO] Node environment setup completed: node v22.2.0
[INFO] Run npm run build -> Build folder generated
[SUCCESS] Uploading artifact dist/ ... Ready. Run completed.`
        },
        {
            id: "jenkins",
            name: "pod/jenkins-automation-server",
            version: "v2.426.3",
            desc: "Writing Jenkinsfile pipeline pipelines for automation build releases. Coordinating pipeline steps and executing shell commands on remote slaves.",
            logs: `[INFO] Starting build task #142...
[INFO] Checking out code from repository...
[INFO] Stage: [Compile Dependencies] -> Executed successfully (12s)
[INFO] Stage: [Unit Tests] -> All tests passing (18s)
[SUCCESS] Pipeline finished status: SUCCESSful.`
        }
    ],
    db: [
        {
            id: "sqlserver",
            name: "pod/mssql-db-administrator",
            version: "v15.0.2",
            desc: "Production SQL Server administration. Automating backups, script queries executions, schema comparisons using Redgate, and migrating DB instances (bacpac).",
            logs: `[INFO] DB admin instance connection active.
[INFO] Executing scheduled database transaction log backup...
[INFO] Backup operation: [SUCCESS] Saved to local storage blob.
[INFO] Running database integrity checks (DBCC CHECKDB)...
[SUCCESS] 0 allocation errors, 0 consistency errors found.`
        },
        {
            id: "dbtools",
            name: "pod/ssms-redgate-operator",
            version: "v19.1.0",
            desc: "Utilizing database administration utilities including SQL Server Management Studio (SSMS), Redgate SQL Compare, PGAdmin, and MongoDB Compass.",
            logs: `[INFO] Running schema diff comparison with Redgate comparison tool...
[INFO] Source Database: Development-Replica
[INFO] Target Database: Production-Instance
[INFO] Results: 2 stored procedures out of sync.
[INFO] Generating deployment synchronisation script...
[SUCCESS] Sync script generated. Ready for code promotion.`
        },
        {
            id: "iis",
            name: "pod/iis-web-host",
            version: "v10.0",
            desc: "Configuring IIS Web Server hosts, managing application pools, binding secure SSL certificates, and troubleshooting HTTP request issues.",
            logs: `[INFO] Querying IIS application pool state...
[INFO] AppPool "SimplifyAppPool": Status: RUNNING (PID: 20994)
[INFO] Active SSL bindings: https://app.simplifyhealthcare.com (443)
[INFO] CPU usage pool: 2.4% / Memory allocation: 512MB
[INFO] Status check: OK`
        }
    ],
    dev: [
        {
            id: "python",
            name: "pod/python-runtime-3-11",
            version: "v3.11.8",
            desc: "Writing scripting tools in Python to automate log monitoring, audit server configurations, and develop Django API backend modules.",
            logs: `[INFO] python --version -> Python 3.11.8
[INFO] Running file script: audit_ports.py
[INFO] Scanning system listening network ports...
[WARNING] Port 8080 listening without firewall block.
[INFO] Script generated firewall recommendation rule. Task complete.`
        },
        {
            id: "dotnet",
            name: "pod/dotnet-runtime",
            version: "v8.0.0",
            desc: "Understanding backend structures, deploying .NET API application pools, and troubleshooting IIS runtime issues.",
            logs: `[INFO] dotnet --info
.NET SDK version: 8.0.100
[INFO] Restoring project dependencies...
[INFO] Restored successfully. (1.2s)
[INFO] Running code compilation: dotnet build -c Release
[SUCCESS] 0 Errors, 0 Warnings.`
        }
    ],
    monitoring: [
        {
            id: "siem",
            name: "pod/siem-security-analyzer",
            version: "v8.11.0",
            desc: "Monitoring system security alerts, parsing system event logs, and identifying threat indicators to resolve production incidents proactively.",
            logs: `[INFO] Connecting to SIEM event indexer gateway...
[INFO] Active streams checked: 4 logs channels active.
[INFO] Parsing event logs for patterns of security vulnerabilities...
[INFO] Alert check: No brute force signatures detected.
[SUCCESS] Cluster security assessment status: SAFE.`
        },
        {
            id: "alerts",
            name: "pod/azure-monitor-alerts",
            version: "v1.12.0",
            desc: "Configuring metrics alerting criteria for disk space thresholds, CPU exhaustion, and memory leaks. Directing alerts to support teams via GLPI/ITSM.",
            logs: `[INFO] Querying monitor rules database...
[INFO] Alert rule [DiskSpaceCritical]: Enabled (Threshold: 85% full)
[INFO] Alert rule [CPUUtilizationHigh]: Enabled (Threshold: 80% for 5 mins)
[INFO] Diagnostic probe active. Host disks capacity checked: 52% free.`
        },
        {
            id: "prompting",
            name: "pod/gpt-ai-assistant",
            version: "v4.0.0",
            desc: "Utilizing AI prompting techniques to brainstorm system designs, write script structures, and automate operational documentation.",
            logs: `[INFO] AI prompt request received: "Generate modular terraform VPC template"
[INFO] LLM completion response constructed (2.4s)
[INFO] Generating terraform files structure...
[INFO] Completed: main.tf, variables.tf, outputs.tf outputted.
[SUCCESS] Template generated.`
        }
    ]
};

// Bind elements
const nsTabs = document.querySelectorAll('.ns-tab');
const podsGrid = document.getElementById('pods-grid');
const podConsoleLogs = document.getElementById('pod-console-logs');
const currentNamespaceTitle = document.querySelector('.current-namespace-title');
const podCountBadge = document.getElementById('pod-count');

function loadNamespacePods(nsKey) {
    const pods = namespacePods[nsKey];
    if (!pods) return;

    // Update namespace title & badge
    const friendlyNames = {
        infra: "ns/cloud-infra",
        containers: "ns/containers-ci-cd",
        db: "ns/databases-admin",
        dev: "ns/languages-it",
        monitoring: "ns/monitoring-ai"
    };
    currentNamespaceTitle.innerHTML = `<i class="fa-solid fa-cube"></i> Namespace: ${friendlyNames[nsKey]}`;
    podCountBadge.textContent = `${pods.length} Pods Running`;

    // Clear grid
    podsGrid.innerHTML = '';

    // Render pods
    pods.forEach((pod, index) => {
        const card = document.createElement('div');
        card.className = `pod-card ${index === 0 ? 'active-pod' : ''}`;
        card.setAttribute('data-pod-id', pod.id);
        card.innerHTML = `
            <div class="pod-status">
                <span class="pod-dot"></span>
                <span class="pod-status-text">Running</span>
            </div>
            <h4 class="pod-name">${pod.name}</h4>
            <span class="pod-version">${pod.version}</span>
        `;

        // Click event listener inside node creation
        card.addEventListener('click', () => {
            document.querySelectorAll('.pod-card').forEach(c => c.classList.remove('active-pod'));
            card.classList.add('active-pod');
            
            // Show logs in console
            const consoleTabName = document.querySelector('.console-tab-name');
            consoleTabName.innerHTML = `<i class="fa-solid fa-code"></i> kubectl logs ${pod.name}`;
            podConsoleLogs.textContent = pod.logs;
        });

        podsGrid.appendChild(card);
    });

    // Default trigger first pod logs printout
    if (pods.length > 0) {
        const consoleTabName = document.querySelector('.console-tab-name');
        consoleTabName.innerHTML = `<i class="fa-solid fa-code"></i> kubectl logs ${pods[0].name}`;
        podConsoleLogs.textContent = pods[0].logs;
    }
}

// Bind tabs click event
nsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        nsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const nsKey = tab.getAttribute('data-ns');
        loadNamespacePods(nsKey);
    });
});

// Initial load default namespace
loadNamespacePods('infra');


/* ==========================================================================
   3. Interactive Deployment Sandbox Orchestrator
   ========================================================================== */
const sandboxForm = document.getElementById('sandbox-form');
const sandboxDeployBtn = document.getElementById('sandbox-deploy-btn');
const sandboxStdoutLogs = document.getElementById('sandbox-stdout-logs');
const sandboxPipelineStatus = document.getElementById('sandbox-pipeline-status');

const flowSteps = {
    init: document.getElementById('step-init'),
    build: document.getElementById('step-build'),
    verify: document.getElementById('step-verify'),
    deploy: document.getElementById('step-deploy')
};

let sandboxRunning = false;

function appendStdoutLine(text, type = '') {
    const div = document.createElement('div');
    div.style.marginBottom = '6px';
    if (type === 'success') div.style.color = 'var(--accent-emerald)';
    if (type === 'error') div.style.color = 'var(--accent-rose)';
    if (type === 'info') div.style.color = 'var(--accent-indigo)';
    
    const time = new Date().toISOString().slice(11, 19);
    div.innerHTML = `<span style="color: var(--text-muted)">[${time}]</span> ${text}`;
    sandboxStdoutLogs.appendChild(div);
    sandboxStdoutLogs.scrollTop = sandboxStdoutLogs.scrollHeight;
}

function resetFlowSteps() {
    Object.values(flowSteps).forEach(step => {
        step.className = 'flow-step';
    });
    // Reset connectors width via CSS manipulation
    document.querySelectorAll('.flow-step-connector').forEach(c => {
        c.style.setProperty('--after-width', '0%');
        c.classList.remove('active-conn');
    });
}

function runSandboxDeployment(event) {
    event.preventDefault();
    if (sandboxRunning) return;

    sandboxRunning = true;
    sandboxDeployBtn.disabled = true;
    sandboxPipelineStatus.className = 'stdout-status running';
    sandboxPipelineStatus.textContent = 'RUNNING';

    // Clear console output
    sandboxStdoutLogs.innerHTML = '';
    resetFlowSteps();

    // Read form values
    const cloudDest = document.querySelector('input[name="cloud"]:checked').value;
    const appStack = document.getElementById('sandbox-stack').value;
    
    // Checked steps
    const selectedSteps = Array.from(document.querySelectorAll('input[name="steps"]:checked')).map(el => el.value);

    // Logs compilation database based on configs chosen
    const cloudName = cloudDest === 'aws' ? 'AWS (ap-south-1)' : 'Azure (ResourceGroup-Prod)';
    const cloudAuthLog = cloudDest === 'aws' 
        ? 'Reading ~/.aws/credentials profile config...' 
        : 'Accessing Azure CLI Service Principal token credentials...';

    let buildLog = '';
    let buildTargetSize = '124MB';
    if (appStack === 'vite') {
        buildLog = 'npm run build ➜ vite build --outDir dist/';
        buildTargetSize = '4.2MB (Static Bundle Assets)';
    } else if (appStack === 'dotnet') {
        buildLog = 'dotnet publish -c Release -o ./publish';
        buildTargetSize = '42.8MB (Binary Executable)';
    } else {
        buildLog = 'pip install -r requirements.txt && python manage.py collectstatic --noinput';
        buildTargetSize = '88.1MB (Django Python Runtime)';
    }

    appendStdoutLine(`Initializing Sandbox Deployment Job (ID: env-deploy-run-${Math.floor(Math.random() * 90000) + 10000})`, 'info');

    // Timeout scheduler sequence
    const pipelineSequence = [
        // --- STEP 1: INIT ---
        {
            delay: 800,
            action: () => {
                flowSteps.init.classList.add('active');
                appendStdoutLine(`[INIT] Connecting to destination cloud host: ${cloudName}...`);
                appendStdoutLine(`[INIT] ${cloudAuthLog}`);
            }
        },
        {
            delay: 1800,
            action: () => {
                flowSteps.init.classList.remove('active');
                flowSteps.init.classList.add('success');
                appendStdoutLine(`[INIT] Connection established. Configured secure gateway.`, 'success');
                // Animate connector 1
                document.querySelectorAll('.flow-step-connector')[0].classList.add('active-conn');
            }
        },
        // --- STEP 2: COMPILE ---
        {
            delay: 2600,
            action: () => {
                flowSteps.build.classList.add('active');
                appendStdoutLine(`[COMPILE] Compiling dependency assets tags...`);
                appendStdoutLine(`[COMPILE] Running target build script: <code>${buildLog}</code>`);
            }
        },
        {
            delay: 3800,
            action: () => {
                appendStdoutLine(`[COMPILE] Packaging files inside docker builder instance...`);
                appendStdoutLine(`[COMPILE] Image output built successfully. Size: ${buildTargetSize}.`);
            }
        },
        {
            delay: 4600,
            action: () => {
                flowSteps.build.classList.remove('active');
                flowSteps.build.classList.add('success');
                appendStdoutLine(`[COMPILE] Artifact created. Docker image tagged: sandbox-deploy:latest`, 'success');
                // Animate connector 2
                document.querySelectorAll('.flow-step-connector')[1].classList.add('active-conn');
            }
        },
        // --- STEP 3: VERIFY ---
        {
            delay: 5400,
            action: () => {
                flowSteps.verify.classList.add('active');
                appendStdoutLine(`[VERIFY] Launching verification checks...`);
                
                if (selectedSteps.includes('test')) {
                    appendStdoutLine(`[VERIFY] Executing automated Jest/NUnit unit tests...`);
                    appendStdoutLine(`[VERIFY] PASS: tests/health.spec.js (0.6s) | PASS: tests/auth.spec.js (1.1s)`);
                } else {
                    appendStdoutLine(`[VERIFY] Unit tests bypassed in configuration form.`);
                }
            }
        },
        {
            delay: 6800,
            action: () => {
                if (selectedSteps.includes('scan')) {
                    appendStdoutLine(`[VERIFY] Running Trivy container vulnerability scanner...`);
                    appendStdoutLine(`[VERIFY] Result: 0 Vulnerabilities flagged (Critical: 0, High: 0).`);
                }
                
                if (selectedSteps.includes('sonar')) {
                    appendStdoutLine(`[VERIFY] Launching SonarQube static code quality analysis...`);
                    appendStdoutLine(`[VERIFY] Gate status: [PASSED] (Code Coverage: 86.4%, Duplications: 0%).`);
                }
            }
        },
        {
            delay: 7600,
            action: () => {
                flowSteps.verify.classList.remove('active');
                flowSteps.verify.classList.add('success');
                appendStdoutLine(`[VERIFY] Verification checks completed successfully. Quality gate passed.`, 'success');
                // Animate connector 3
                document.querySelectorAll('.flow-step-connector')[2].classList.add('active-conn');
            }
        },
        // --- STEP 4: HOST ---
        {
            delay: 8400,
            action: () => {
                flowSteps.deploy.classList.add('active');
                appendStdoutLine(`[HOST] Initiating rollout to orchestrator cluster...`);
                
                if (cloudDest === 'aws') {
                    appendStdoutLine(`[HOST] Scaling ECS services tasks... allocating active pods...`);
                } else {
                    appendStdoutLine(`[HOST] Swapping slots traffic to azure app services production endpoint...`);
                }
            }
        },
        {
            delay: 9600,
            action: () => {
                appendStdoutLine(`[HOST] Configuring load balancer ingress controller mapping...`);
                appendStdoutLine(`[HOST] Traffic routes: [HEALTHY] status check verified.`);
            }
        },
        {
            delay: 10400,
            action: () => {
                flowSteps.deploy.classList.remove('active');
                flowSteps.deploy.classList.add('success');
                
                const siteUrl = cloudDest === 'aws' ? 'http://aws-loadbalancer-142.ap-south-1.elb.amazonaws.com' : 'https://abhishek-app.azurewebsites.net';
                appendStdoutLine(`[HOST] Deployment successful. Sandbox is fully operational.`, 'success');
                appendStdoutLine(`-------------------------------------------------------------------------------------`);
                appendStdoutLine(`ENDPOINT ACCESS URL: <a href="#" style="color: var(--accent-emerald); font-weight: bold;">${siteUrl}</a>`);
                appendStdoutLine(`-------------------------------------------------------------------------------------`);
                
                sandboxRunning = false;
                sandboxDeployBtn.disabled = false;
                sandboxPipelineStatus.className = 'stdout-status success';
                sandboxPipelineStatus.textContent = 'SUCCESS';
            }
        }
    ];

    // Trigger scheduled pipeline steps
    pipelineSequence.forEach(step => {
        setTimeout(step.action, step.delay);
    });
}

if (sandboxForm) {
    sandboxForm.addEventListener('submit', runSandboxDeployment);
}


/* ==========================================================================
   4. Interactive Blueprint Details (Drop Shipping Project)
   ========================================================================== */
const bpNodes = document.querySelectorAll('.bp-node');
const bpSpecTitle = document.getElementById('bp-spec-title');
const bpSpecDesc = document.getElementById('bp-spec-desc');
const bpSpecTf = document.getElementById('bp-spec-tf');
const copyTfBtn = document.getElementById('copy-tf-btn');

// Blueprint resources details data mapping
const bpNodeSpecs = {
    alb: {
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
    ec2: {
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
    rds: {
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
    s3: {
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
    cw: {
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

bpNodes.forEach(node => {
    if (node.id === 'bp-node-client') return;

    node.addEventListener('click', () => {
        bpNodes.forEach(n => n.classList.remove('active-bp-node'));
        node.classList.add('active-bp-node');

        const key = node.getAttribute('data-node');
        const spec = bpNodeSpecs[key];

        if (spec) {
            // Animate details reload smoothly
            const panel = document.getElementById('bp-specs-panel');
            panel.style.opacity = 0.3;
            panel.style.transform = 'translateY(5px)';

            setTimeout(() => {
                bpSpecTitle.textContent = spec.title;
                bpSpecDesc.textContent = spec.desc;
                bpSpecTf.textContent = spec.tf;
                
                panel.style.opacity = 1;
                panel.style.transform = 'translateY(0)';
            }, 120);
        }
    });
});

// Copy terraform script button implementation
if (copyTfBtn) {
    copyTfBtn.addEventListener('click', () => {
        const codeText = bpSpecTf.textContent;
        navigator.clipboard.writeText(codeText).then(() => {
            copyTfBtn.textContent = 'Copied!';
            copyTfBtn.style.color = 'var(--accent-emerald)';
            setTimeout(() => {
                copyTfBtn.textContent = 'Copy code';
                copyTfBtn.style.color = 'var(--accent-indigo)';
            }, 2000);
        }).catch(err => {
            console.error('Copy code failed: ', err);
        });
    });
}


/* ==========================================================================
   5. Contact YAML Manifest Form Connection
   ========================================================================== */
const contactForm = document.getElementById('manifest-contact-form');
const formFeedback = document.getElementById('yaml-form-feedback');
const submitBtn = document.getElementById('manifest-submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deploying...';
        formFeedback.className = 'yaml-form-feedback';
        formFeedback.style.display = 'none';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
            formFeedback.className = 'yaml-form-feedback success';
            formFeedback.innerHTML = '<i class="fa-solid fa-check"></i> connectionrequest.v1.yaml successfully promoting state. Gateway status: message forwarded.';
            formFeedback.style.display = 'block';
            
            contactForm.reset();
            
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 6000);
        }, 1500);
    });
}

// Mobile toggle menu listener
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
        });
    });
}
