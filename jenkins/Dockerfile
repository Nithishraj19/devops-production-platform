FROM jenkins/jenkins:lts-jdk21

USER root

RUN apt-get update \
    && apt-get install -y docker.io curl \
    && curl -Lo /usr/local/bin/kind https://kind.sigs.k8s.io/dl/v0.33.0/kind-linux-amd64 \
    && chmod +x /usr/local/bin/kind \
    && curl -LO "https://dl.k8s.io/release/v1.37.0/bin/linux/amd64/kubectl" \
    && install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl \
    && rm kubectl \
    && rm -rf /var/lib/apt/lists/*

RUN usermod -aG root jenkins

USER jenkins
