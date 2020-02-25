import os
import requests

def deploy():
    password = os.getenv('SALT_PASSWORD')

    if not password:
        raise Exception('SALT_PASSWORD must be provided as an env var')

    auth_resp = requests.post(
        'https://salt.eligundry.ninja/login',
        data={
            'username': 'github-actions',
            'password': password,
            'eauth': 'pam',
        }
    )

    auth_resp.raise_for_status()
    token = auth_resp.json()['return'][0]['token']

    deploy_request = requests.post(
        'https://salt.eligundry.ninja',
        headers={
            'Accept': 'application/x-yaml',
            'X-Auth-Token': token,
        },
        json={
            'client': 'local',
            'tgt': 'salt-eligundry-ninja',
            'fun': 'state.apply',
            'arg': [
                'server.website',
            ],
        }
    )

    deploy_request.raise_for_status()
    print(deploy_request.text)


deploy()
