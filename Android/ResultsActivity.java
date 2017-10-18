package comtelekpsi.github.oviedofireandroid;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.LinearLayout;
import android.widget.TableLayout;
import android.widget.TextView;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URL;

public class ResultsActivity extends AppCompatActivity {

    private TableLayout mTableLayout;
    private LinearLayout mLinearLayout;
    private TextView mUsernameTextView;
    private TextView mCBTextView;
    private TextView mTitleTextView;
    private TextView mDateCBTextView;
    private String formId;
    private String uid;
    private String username;
    public static final String UID_SAVE = "UIDSaveFile";
    private URL url;
    Context context;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_results);
        SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid = uidSave.getString("pUID", null);
        username = uidSave.getString("pUsername", null);
        Log.e("HEREHERE","Results successfully retrieved username: "+username);
        formId = getIntent().getStringExtra("FORM_ID");
        mTableLayout=(TableLayout) findViewById(R.id.tableResultsLayout);
        context = this;
        mCBTextView = (TextView) findViewById(R.id.completedByResultsTextView);
        mDateCBTextView = (TextView) findViewById(R.id.dateCBResultsTextView);
        mTitleTextView = (TextView) findViewById(R.id.formTitleResultsTextView);
        mTitleTextView.setTextColor(Color.BLACK);
        mLinearLayout = (LinearLayout) findViewById(R.id.linearResultsLayout);
        mUsernameTextView=(TextView) findViewById(R.id.usernameResultsTextView);
        mUsernameTextView.setText(username);
        new ResultsActivity.RetrieveJSON().execute();
    }

    class RetrieveJSON extends AsyncTask<Void, Void, String> {
        private ProgressDialog dialog = new ProgressDialog(ResultsActivity.this);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        protected String doInBackground(Void... urls) {
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/results/?uid="+uid+"&formId="+formId);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while ((line = bufferedReader.readLine()) != null) {
                        stringBuilder.append(line).append("\n");
                    }
                    bufferedReader.close();
                    System.out.println(stringBuilder.toString());
                    return stringBuilder.toString();
                }
                finally{
                    urlConnection.disconnect();
                }
            }
            catch(Exception e) {
                Log.e("ERROR", e.getMessage(), e);
                return null;
            }
        }
        protected void onPostExecute(String response) {
            if(response == null)
                response = "THERE WAS AN ERROR";
            Log.i("INFO", response);
            if (dialog.isShowing()) {
                dialog.dismiss();
            }
            ResultsJSONParser.resultsParse(response, mTitleTextView, mCBTextView, mDateCBTextView, mTableLayout, context);
        }
    }

}
