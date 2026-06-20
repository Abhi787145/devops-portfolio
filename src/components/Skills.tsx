import React, { useState } from 'react';
import './styles/Skills.css';

type PodInfo = {
  id: string;
  name: string;
  version: string;
  desc: string;
  logs: string;
};

const namespacePods: Record<string, PodInfo[]> = {
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

const friendlyNames: Record<string, string> = {
  infra: "ns/cloud-infra",
  containers: "ns/containers-ci-cd",
  db: "ns/databases-admin",
  dev: "ns/languages-it",
  monitoring: "ns/monitoring-ai"
};

const Skills = () => {
  const [activeNs, setActiveNs] = useState('infra');
  const pods = namespacePods[activeNs] || [];
  const [activePod, setActivePod] = useState<PodInfo>(pods[0] || {});

  const handleNsChange = (ns: string) => {
    setActiveNs(ns);
    const newPods = namespacePods[ns] || [];
    setActivePod(newPods[0] || {});
  };

  return (
    <section id="infrastructure" className="cluster-section container">
      <div className="section-title-wrapper">
        <span className="sec-label">resource manager</span>
        <h3 className="sec-title">Cloud Infrastructure & Tech Stack</h3>
        <p className="sec-desc">Explore the container namespaces containing my core DevOps tools, database skills, and platform competencies.</p>
      </div>

      <div className="cluster-layout-card glass-panel">
        <div className="cluster-namespaces">
          <div className="namespace-header">NAMESPACES</div>
          {Object.keys(namespacePods).map((nsKey) => (
            <button
              key={nsKey}
              className={`ns-tab ${activeNs === nsKey ? 'active' : ''}`}
              onClick={() => handleNsChange(nsKey)}
            >
              {friendlyNames[nsKey]}
            </button>
          ))}
        </div>

        <div className="pods-view-panel">
          <div className="panel-header">
            <span className="current-namespace-title">
              <i className="fa-solid fa-cube"></i> Namespace: {friendlyNames[activeNs]}
            </span>
            <span className="pod-count-badge">{pods.length} Pods Running</span>
          </div>

          <div className="pods-grid">
            {pods.map((pod) => (
              <div
                key={pod.id}
                className={`pod-card ${activePod.id === pod.id ? 'active-pod' : ''}`}
                onClick={() => setActivePod(pod)}
              >
                <div className="pod-status">
                  <span className="pod-dot"></span>
                  <span className="pod-status-text">Running</span>
                </div>
                <h4 className="pod-name">{pod.name}</h4>
                <span className="pod-version">{pod.version}</span>
              </div>
            ))}
          </div>

          {activePod.id && (
            <div className="pod-console-logger">
              <div className="console-bar">
                <span className="console-tab-name">
                  <i className="fa-solid fa-code"></i> kubectl logs {activePod.name}
                </span>
                <span className="console-timestamp">200 OK</span>
              </div>
              <div className="console-output-area">
                {activePod.logs}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="platform-grid-card glass-panel">
        <div className="platform-grid-header">
          <h4><i className="fa-solid fa-server"></i> Main Core Competency Platforms</h4>
        </div>
        <div className="platforms-flex">
          {/* AWS Platform */}
          <div className="platform-item">
            <div className="platform-logo-wrapper">
              <svg className="svg-logo" viewBox="0 0 100 100" fill="currentColor">
                <path fill="#FF9900" d="M47.7,13.6c-4.9-0.2-9.7,2.1-12.7,6.1c-1.3,1.7-2,3.8-2.1,6c-0.1,5.2,4,9.6,9.2,9.7c5.1,0.1,9.4-3.7,9.7-8.8c0.2-3.1-0.9-6.1-3.2-8.3C49.9,13.9,48.8,13.7,47.7,13.6z"/>
                <path fill="#232F3E" d="M84.2,56.8c0-10.4-8.8-14.7-22.3-15.8c-10.5-0.9-19.1,1.1-23.7,3.6c-1.3,0.7-2,2.2-1.7,3.6l1.9,8.4c0.3,1.2,1.3,2.1,2.5,2.1c2.8-1.5,8-3,13.6-2.5c8.3,0.7,11.3,3.3,11.3,7.4v1.8c-6,0.3-15,0.9-22.3,3.8c-7.9,3.1-13,9.5-13,17.4c0,9,7.1,14.6,17.3,14.6c8.5,0,15.2-4.1,18.7-9.5c0.8,3,3,5.4,5.9,6.5c1.4,0.5,2.9,0.5,4.3,0.1c1.2-0.4,2.2-1.2,2.7-2.3c1.7-3.7,2.1-11,2.1-17.7V56.8z M65,75c0,6.5-4,10.6-10.3,10.6c-5.1,0-8.2-2.9-8.2-7.5c0-5.8,4.6-8.3,11.8-9c4-0.4,5.8-0.6,6.7-0.7V75z"/>
                <path fill="#FF9900" d="M12,83c16.2,10.7,37,16.2,56.3,14.8c12.2-0.9,23.8-4.7,33.7-11.2c1.7-1.1,1.9-3.4,0.6-4.9c-0.8-0.9-2.1-1.3-3.2-0.9c-9.5,4.9-20.3,7.6-31.2,7.9c-17.1,0.5-35.4-3.8-49.8-13.4c-1.7-1.1-4-0.6-5.1,1.1C12,81,11.7,82.1,12,83L12,83z M97.7,80c-0.9-1.2-2.6-1.5-3.8-0.7c-0.7,0.5-1.1,1.2-1.3,2l-0.8,4c-0.3,1.3,0.6,2.5,1.9,2.8c0.2,0,0.4,0,0.6,0l4.5-0.9c1.3-0.3,2.2-1.4,2.1-2.7c-0.1-0.9-0.6-1.7-1.4-2.1L97.7,80z"/>
              </svg>
            </div>
            <h5>Amazon Web Services (AWS)</h5>
            <p>VPC Networking Subnets, EC2 Instance Nodes, RDS Multi-AZ Databases administration, S3 Bucket assets, Lambda API endpoints, Route53, and CloudWatch metrics operations.</p>
          </div>

          {/* Azure Platform */}
          <div class="platform-item">
            <div class="platform-logo-wrapper">
              <svg className="svg-logo" viewBox="0 0 100 100" fill="currentColor">
                <path fill="#0089D6" d="M13,67L35,22L53,42L22,81L13,67Z"/>
                <path fill="#00BCF2" d="M53,42L77,13L87,26L48,87L31,69L53,42Z"/>
              </svg>
            </div>
            <h5>Microsoft Azure</h5>
            <p>Virtual Machines deployment, Storage Accounts, App Services plans hosting, Key Vault secure credentials management, SQL Server instances, and Elastic Pools.</p>
          </div>

          {/* Kubernetes */}
          <div class="platform-item">
            <div class="platform-logo-wrapper">
              <svg className="svg-logo" viewBox="0 0 100 100" fill="currentColor">
                <path fill="#326CE5" d="M50,9.2L85.3,22V63.6L50,91.8L14.7,63.6V22L50,9.2Z M50,17.4L21.8,27.7V59.4L50,81.9L78.2,59.4V27.7L50,17.4Z"/>
                <path fill="#326CE5" d="M50,30.3L64.1,44.4L50,58.5L35.9,44.4L50,30.3Z M50,36L41.6,44.4L50,52.8L58.4,44.4L50,36Z"/>
                <line x1="50" y1="9.2" x2="50" y2="30.3" stroke="#326CE5" strokeWidth="4"/>
                <line x1="85.3" y1="22" x2="64.1" y2="44.4" stroke="#326CE5" strokeWidth="4"/>
                <line x1="85.3" y1="63.6" x2="64.1" y2="44.4" stroke="#326CE5" strokeWidth="4"/>
                <line x1="50" y1="91.8" x2="50" y2="58.5" stroke="#326CE5" strokeWidth="4"/>
                <line x1="14.7" y1="63.6" x2="35.9" y2="44.4" stroke="#326CE5" strokeWidth="4"/>
                <line x1="14.7" y1="22" x2="35.9" y2="44.4" stroke="#326CE5" strokeWidth="4"/>
              </svg>
            </div>
            <h5>Kubernetes</h5>
            <p>Orchestrating container pods, scaling workloads replicas, configuring persistent storage volumes, and defining custom yaml node specifications.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
