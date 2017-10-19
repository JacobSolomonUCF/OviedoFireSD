package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    private FirebaseAuth mAuth;
    private FirebaseAuth.AuthStateListener mAuthListener;
    private static final String TAG = "EmailPassword";
    private String uid;
    private EditText mEmailField;
    private EditText mPasswordField;
    private boolean flag = false;
    private String username;
    Context context;
    private Button mButton;
    public static final String EMAIL_SAVE = "EMAILSAVE";
    public static final String UID_SAVE = "UIDSaveFile";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        context=this;
        SharedPreferences emailSave = getSharedPreferences(EMAIL_SAVE, Context.MODE_PRIVATE);
        SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor2 = uidSave.edit();
        editor2.clear();
        mButton=(Button) findViewById(R.id.email_sign_in_button);
        mEmailField = (EditText) findViewById(R.id.email);
        mPasswordField = (EditText) findViewById(R.id.password);
        mPasswordField.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if ((event.getAction() == KeyEvent.ACTION_DOWN) &&
                        (keyCode == KeyEvent.KEYCODE_ENTER)) {
                    // Perform action on key press
                    onClick(mButton);
                    return true;
                }
                return false;
            }
        });

        findViewById(R.id.email_sign_in_button).setOnClickListener(this);
        // [START initialize_auth]
        mAuth = FirebaseAuth.getInstance();
        mAuthListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser user = firebaseAuth.getCurrentUser();
                if (user != null) {
                    // User is signed in
                    Log.d(TAG, "onAuthStateChanged:signed_in:" + user.getUid());
                } else {
                    // User is signed out
                    Log.d(TAG, "onAuthStateChanged:signed_out");
                }
            }
        };
        if(emailSave.getString("pEmail",null)!=null&&!emailSave.getString("pEmail",null).isEmpty())
            mEmailField.setText(emailSave.getString("pEmail",null));

// [END initialize_auth]
    }

    @Override
    protected void onResume(){
        super.onResume();
        context=this;
        SharedPreferences emailSave = getSharedPreferences(EMAIL_SAVE, Context.MODE_PRIVATE);
        mEmailField = (EditText) findViewById(R.id.email);
        mPasswordField = (EditText) findViewById(R.id.password);
        mAuth = FirebaseAuth.getInstance();
        mAuthListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser user = firebaseAuth.getCurrentUser();
                if (user != null) {
                    // User is signed in
                    Log.d(TAG, "onAuthStateChanged:signed_in:" + user.getUid());
                } else {
                    // User is signed out
                    Log.d(TAG, "onAuthStateChanged:signed_out");
                }
            }
        };
        if(emailSave.getString("pEmail",null)!=null&&!emailSave.getString("pEmail",null).isEmpty())
            mEmailField.setText(emailSave.getString("pEmail",null));
    }

    private void signIn(String email, String password) {
        Log.d(TAG, "signIn:" + email);
        if (!validateForm()) {
            return;
        }
        //showProgressDialog();

        // [START sign_in_with_email]
        mAuth.signInWithEmailAndPassword(email, password)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            Log.d(TAG, "signInWithEmail:success");
                            Toast.makeText(MainActivity.this, "Successfully Logged In.",
                                    Toast.LENGTH_SHORT).show();
                            FirebaseUser user = mAuth.getCurrentUser();
                            flag=true;
                            //System.out.println("I got set true here");
                            if (user != null) {
                                // The user's ID, unique to the Firebase project. Do NOT use this value to
                                // authenticate with your backend server, if you have one. Use
                                // FirebaseUser.getToken() instead.
                                uid = user.getUid();
                            }
                        } else {
                            // If sign in fails, display a message to the user.
                            Log.w(TAG, "signInWithEmail:failure", task.getException());
                            flag=false;
                            System.out.println("I got set false here");
                            Toast.makeText(MainActivity.this, "Login failed.",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                });
        // [END sign_in_with_email]
    }
    private boolean validateForm() {
        boolean valid = true;
        String email = mEmailField.getText().toString();
        if (TextUtils.isEmpty(email)) {
            mEmailField.setError("Required.");
            valid = false;
        } else {
            mEmailField.setError(null);
        }
        String password = mPasswordField.getText().toString();
        if (TextUtils.isEmpty(password)) {
            mPasswordField.setError("Required.");
            valid = false;
        } else {
            mPasswordField.setError(null);
        }
        return valid;
    }
    @Override
    public void onStart() {
        super.onStart();
        mAuth.addAuthStateListener(mAuthListener);
    }
    @Override
    public void onStop() {
        super.onStop();
        if (mAuthListener != null) {
            mAuth.removeAuthStateListener(mAuthListener);
        }
    }

    @Override
    public void onClick(View v) {
        final View view=v;
        int i = v.getId();
        if (i == R.id.email_sign_in_button) {
            signIn(mEmailField.getText().toString(), mPasswordField.getText().toString());

            Runnable r = new Runnable() {
                @Override
                public void run(){
                    System.out.println(flag);
                    if (flag==true&&validateForm()==true) {
                        SharedPreferences emailSave = getSharedPreferences(EMAIL_SAVE, 0);
                        SharedPreferences.Editor editor = emailSave.edit();
                        editor.putString("pEmail", mEmailField.getText().toString());
                        editor.commit();
                        //username=mEmailField.getText().toString().substring(0,mEmailField.getText().toString().indexOf('@'));
                        mainMenu(view);
                    }
                }
            };
            Handler h = new Handler();
            h.postDelayed(r, 3100);
        }
    }
    public void mainMenu(View view){
        Intent intent = new Intent(MainActivity.this, MainMenuActivity.class);
        intent.putExtra("USER_ID", uid);
        //intent.putExtra("USER_NAME", username);
        startActivity(intent);
    }

    @Override
    public void onBackPressed(){
        Intent a = new Intent(Intent.ACTION_MAIN);
        a.addCategory(Intent.CATEGORY_HOME);
        a.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(a);
    }
}
