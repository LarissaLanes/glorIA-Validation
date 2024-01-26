//
//  ViewController.swift
//  gloria
//
//  Created by Larissa Lanes on 26/01/24.
//

import UIKit

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Set background color
        view.backgroundColor = .red

        // Create navigation bar
        let navigationBar = UINavigationBar()
        navigationBar.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(navigationBar)

        // Set navigation bar constraints
        NSLayoutConstraint.activate([
            navigationBar.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            navigationBar.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            navigationBar.trailingAnchor.constraint(equalTo: view.trailingAnchor)
        ])

        // Create navigation item
        let navigationItem = UINavigationItem(title: "Tela Inicial")
        navigationBar.setItems([navigationItem], animated: false)

        // Create button
        let button = UIBarButtonItem(title: "Proxima Tela", style: .plain, target: self, action: #selector(nextScreenButtonTapped))
        navigationItem.rightBarButtonItem = button
    }

    @objc func nextScreenButtonTapped() {
        // Create the new screen you want to present
        let nextViewController = ChatViewController() // Replace OtherViewController with the actual name of your other view controller
        navigationController?.pushViewController(nextViewController, animated: true)
    }
}


