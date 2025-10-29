# variable "aws_region" {
#   type    = string
#   default = "us-west-2"
# }

# variable "instance_type" {
#   type    = string
#   default = "t3.micro"
# }

# variable "docker_username" {
#   type        = string
#   description = "Docker Hub username for pulling images"
#   default     = "your-dockerhub-username"
# }
# ------

variable "aws_region" {
  type    = string
  default = "eu-north-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "docker_username" {
  type        = string
  description = "Docker Hub username for pulling images"
  default     = "jaaswanth07"
}


variable "datasource_url" {
  type        = string
  description = "Database connection URL"
  default     = "jdbc:mysql://mysql:3306/ims_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
}

variable "datasource_username" {
  type        = string
  description = "Database username"
  default     = "ims_user"
}

variable "datasource_password" {
  type        = string
  description = "Database password"
  default     = "ims_password"
  sensitive   = true

  
}

variable "mysql_root_password" {
  type        = string
  description = "Root password for MySQL (for admin use only)"
  default     = "root"
  sensitive   = true
}

